import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import type { AddToCartInput } from "@/types";

const kebab: AddToCartInput = {
  dishId: "kebab-grille",
  name: "Kebab grillé",
  image: "/images/kebab-grille.webp",
  basePrice: 15,
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext", () => {
  it("ajoute un article et calcule les totaux", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(kebab));
    expect(result.current.totalCount).toBe(1);
    expect(result.current.totalPrice).toBe(15);
  });

  it("incrémente la quantité d'une ligne identique", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(kebab));
    act(() => result.current.addItem(kebab));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.totalPrice).toBe(30);
  });

  it("crée des lignes distinctes selon les options", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() =>
      result.current.addItem({
        ...kebab,
        options: [
          { groupId: "g", optionId: "o1", label: "Riz", priceDelta: 0 },
        ],
      }),
    );
    act(() =>
      result.current.addItem({
        ...kebab,
        options: [
          { groupId: "g", optionId: "o2", label: "Frites", priceDelta: 1 },
        ],
      }),
    );
    expect(result.current.items).toHaveLength(2);
    // 15 + (15+1)
    expect(result.current.totalPrice).toBe(31);
  });

  it("ajoute le surcoût des options au prix unitaire", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() =>
      result.current.addItem({
        ...kebab,
        options: [
          { groupId: "g", optionId: "o3", label: "Avocat", priceDelta: 2 },
        ],
      }),
    );
    expect(result.current.items[0].unitPrice).toBe(17);
  });

  it("supprime une ligne quand la quantité tombe à 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(kebab));
    const lineId = result.current.items[0].lineId;
    act(() => result.current.updateQuantity(lineId, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("persiste le panier dans localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(kebab));
    const stored = JSON.parse(localStorage.getItem("restaurant-cart") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].dishId).toBe("kebab-grille");
  });

  it("vide le panier", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(kebab));
    act(() => result.current.clear());
    expect(result.current.totalCount).toBe(0);
  });
});
