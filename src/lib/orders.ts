import "server-only";
import type { Prisma } from "@prisma/client";
import type {
  CartLineOption,
  Fulfillment,
  Order,
  OrderLine,
  OrderStatus,
} from "@/types";
import { prisma } from "@/lib/prisma";
import { upsertCustomer } from "@/lib/customers";
import { evaluatePromo, consumePromo } from "@/lib/promo";
import { quoteDelivery } from "@/lib/delivery";
import { awardPointsForOrder } from "@/lib/loyalty";
import { formatPrice } from "@/lib/utils";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";
import { getDefaultRestaurant } from "@/lib/restaurants";

interface CreateOrderInput {
  customer: Order["customer"];
  items: OrderLine[];
  promoCode?: string;
  fulfillment?: Fulfillment;
  postalCode?: string;
  tip?: number;
  scheduledAt?: string;
}

type OrderRow = Prisma.OrderGetPayload<{ include: { items: true } }>;

export class OrderCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderCreationError";
  }
}

/** Convertit une ligne Prisma en type métier `Order`. */
function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    restaurantId: row.restaurantId ?? undefined,
    reference: row.reference,
    createdAt: row.createdAt.toISOString(),
    status: row.status as OrderStatus,
    customer: {
      name: row.customerName,
      email: row.customerEmail,
      phone: row.customerPhone,
      address: row.customerAddress ?? undefined,
      notes: row.customerNotes ?? undefined,
    },
    items: row.items.map((i) => ({
      id: i.dishId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      options: (i.options as CartLineOption[] | null) ?? undefined,
      note: i.note ?? undefined,
    })),
    subtotal: row.subtotal,
    discount: row.discount,
    promoCode: row.promoCode ?? undefined,
    fulfillment: row.fulfillment as Fulfillment,
    deliveryFee: row.deliveryFee,
    tip: row.tip,
    scheduledAt: row.scheduledAt?.toISOString() ?? undefined,
    prepTimeMin: row.prepTimeMin,
    total: row.total,
  };
}

/** Crée une commande (statut « en attente »), applique le promo, persiste, notifie. */
export async function createOrder({
  customer,
  items,
  promoCode,
  fulfillment = "emporter",
  postalCode,
  tip = 0,
  scheduledAt,
}: CreateOrderInput): Promise<Order> {
  const restaurant = await getDefaultRestaurant();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  let appliedCode: string | undefined;
  if (promoCode) {
    const promo = await evaluatePromo(promoCode, subtotal);
    if (promo.valid && promo.discount) {
      discount = promo.discount;
      appliedCode = promo.code;
    }
  }

  // Frais de livraison selon la zone (uniquement en mode livraison).
  let deliveryFee = 0;
  if (fulfillment === "livraison") {
    const q = await quoteDelivery(postalCode ?? "", subtotal);
    if (!q.available) {
      throw new OrderCreationError(q.reason ?? "Livraison indisponible.");
    }
    deliveryFee = q.fee;
  }

  const safeTip = Math.max(0, tip);
  const total = Math.max(0, subtotal - discount) + deliveryFee + safeTip;
  const ref = `NK-${Date.now().toString(36).toUpperCase()}`;

  // Temps de préparation = max des temps des plats (préparés en parallèle).
  const dishes = await prisma.dish.findMany({
    where: { slug: { in: items.map((i) => i.id) } },
    select: { prepMinutes: true },
  });
  const prepTimeMin = dishes.length
    ? Math.max(...dishes.map((d) => d.prepMinutes))
    : 20;

  const row = await prisma.order.create({
    data: {
      reference: ref,
      status: "en attente",
      customerName: customer.name,
      customerEmail: customer.email.toLowerCase(),
      customerPhone: customer.phone,
      restaurantId: restaurant?.id,
      customerAddress: customer.address,
      customerNotes: customer.notes,
      subtotal,
      discount,
      promoCode: appliedCode,
      fulfillment,
      deliveryFee,
      tip: safeTip,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      prepTimeMin,
      total,
      events: { create: { status: "en attente", actor: "client" } },
      items: {
        create: items.map((i) => ({
          dishId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          options: i.options ? (i.options as unknown as Prisma.InputJsonValue) : undefined,
          note: i.note,
        })),
      },
    },
    include: { items: true },
  });

  if (appliedCode) await consumePromo(appliedCode);

  await upsertCustomer(customer.email, {
    name: customer.name,
    phone: customer.phone,
  });

  await sendEmail({
    to: customer.email,
    subject: `Confirmation de votre commande ${ref}`,
    html: `<h1>Merci ${customer.name} !</h1>
      <p>Votre commande <strong>${ref}</strong> a bien été enregistrée.</p>
      <p>Montant total : <strong>${formatPrice(total)}</strong></p>`,
  });

  // Automation : confirmation par SMS.
  await sendSms({
    to: customer.phone,
    body: `N'KULU : votre commande ${ref} (${formatPrice(total)}) est bien reçue. Merci ${customer.name} !`,
  });

  return toOrder(row);
}

/** Retourne une commande par référence. */
export async function getOrderByReference(
  reference: string,
): Promise<Order | undefined> {
  const row = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  return row ? toOrder(row) : undefined;
}

/** Retourne toutes les commandes (back-office), plus récentes d'abord. */
export async function getAllOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

/** Retourne les commandes d'un email (espace client), plus récentes d'abord. */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { customerEmail: email.toLowerCase() },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

/** Met à jour le statut d'une commande et journalise l'événement (audit). */
export async function updateOrderStatus(
  reference: string,
  status: OrderStatus,
  actor = "système",
): Promise<Order | undefined> {
  try {
    const row = await prisma.order.update({
      where: { reference },
      data: {
        status,
        events: { create: { status, actor } },
      },
      include: { items: true },
    });
    // Attribution des points de fidélité au paiement (idempotent).
    if (status === "payée") await awardPointsForOrder(reference);

    // Automation : notifier le client aux étapes clés.
    if (status === "prête" || status === "livrée") {
      const msg =
        status === "prête"
          ? `Votre commande ${reference} est prête !`
          : `Votre commande ${reference} a été livrée. Bon appétit !`;
      await sendEmail({
        to: row.customerEmail,
        subject: `N'KULU — commande ${reference}`,
        html: `<p>${msg}</p>`,
      });
      await sendSms({ to: row.customerPhone, body: `N'KULU : ${msg}` });
    }
    return toOrder(row);
  } catch {
    return undefined;
  }
}

/** Journal d'audit (timeline) d'une commande. */
export async function getOrderEvents(reference: string) {
  const order = await prisma.order.findUnique({
    where: { reference },
    select: { id: true },
  });
  if (!order) return [];
  return prisma.orderEvent.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: "asc" },
  });
}
