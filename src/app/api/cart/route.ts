import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/cart — enregistre/actualise un panier côté serveur (funnel + relance).
 * Appelé (fire-and-forget) par le panier client et au checkout.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.cartId || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const items = body.items as { quantity: number; unitPrice: number }[];
  const itemCount = items.reduce((s, i) => s + (i.quantity ?? 0), 0);
  const total = items.reduce((s, i) => s + (i.unitPrice ?? 0) * (i.quantity ?? 0), 0);

  // Panier vidé → on retire le suivi (sauf s'il a déjà converti).
  if (itemCount === 0) {
    await prisma.abandonedCart
      .deleteMany({ where: { cartId: body.cartId, status: "actif" } })
      .catch(() => {});
    return NextResponse.json({ ok: true });
  }

  const email = body.email ? String(body.email).toLowerCase() : undefined;
  await prisma.abandonedCart.upsert({
    where: { cartId: body.cartId },
    update: {
      items: body.items,
      itemCount,
      total,
      ...(email ? { email } : {}),
      ...(body.name ? { name: String(body.name) } : {}),
      ...(body.phone ? { phone: String(body.phone) } : {}),
    },
    create: {
      cartId: body.cartId,
      items: body.items,
      itemCount,
      total,
      email,
      name: body.name ? String(body.name) : undefined,
      phone: body.phone ? String(body.phone) : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
