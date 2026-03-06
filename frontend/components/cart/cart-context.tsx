"use client";

import type {
  KeyBoard,
  KeyBoardItem,
  Product,
  ProductVariant,
} from "lib/shopify/types";
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

type UpdateType = "plus" | "minus" | "delete";

type KeyBoardAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

type KeyBoardContextType = {
  cartPromise: Promise<KeyBoard | undefined>;
};

const KeyBoardContext = createContext<KeyBoardContextType | undefined>(
  undefined,
);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateKeyBoardItem(
  item: KeyBoardItem,
  updateType: UpdateType,
): KeyBoardItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateKeyBoardItem(
  existingItem: KeyBoardItem | undefined,
  variant: ProductVariant,
  product: Product,
): KeyBoardItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function updateKeyBoardTotals(
  lines: KeyBoardItem[],
): Pick<KeyBoard, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyKeyBoard(): KeyBoard {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

function cartReducer(
  state: KeyBoard | undefined,
  action: KeyBoardAction,
): KeyBoard {
  const currentKeyBoard = state || createEmptyKeyBoard();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentKeyBoard.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateKeyBoardItem(item, updateType)
            : item,
        )
        .filter(Boolean) as KeyBoardItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentKeyBoard,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentKeyBoard.cost,
            totalAmount: { ...currentKeyBoard.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentKeyBoard,
        ...updateKeyBoardTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentKeyBoard.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateKeyBoardItem(
        existingItem,
        variant,
        product,
      );

      const updatedLines = existingItem
        ? currentKeyBoard.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...currentKeyBoard.lines, updatedItem];

      return {
        ...currentKeyBoard,
        ...updateKeyBoardTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentKeyBoard;
  }
}

export function KeyBoardProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<KeyBoard | undefined>;
}) {
  return (
    <KeyBoardContext.Provider value={{ cartPromise }}>
      {children}
    </KeyBoardContext.Provider>
  );
}

export function useKeyBoard() {
  const context = useContext(KeyBoardContext);
  if (context === undefined) {
    throw new Error("useKeyBoard must be used within a KeyBoardProvider");
  }

  const initialKeyBoard = use(context.cartPromise);
  const [optimisticKeyBoard, updateOptimisticKeyBoard] = useOptimistic(
    initialKeyBoard,
    cartReducer,
  );

  const updateKeyBoardItem = (
    merchandiseId: string,
    updateType: UpdateType,
  ) => {
    updateOptimisticKeyBoard({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType },
    });
  };

  const addKeyBoardItem = (variant: ProductVariant, product: Product) => {
    updateOptimisticKeyBoard({
      type: "ADD_ITEM",
      payload: { variant, product },
    });
  };

  return useMemo(
    () => ({
      cart: optimisticKeyBoard,
      updateKeyBoardItem,
      addKeyBoardItem,
    }),
    [optimisticKeyBoard],
  );
}
