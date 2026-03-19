import type { Product } from "./types";

const createMockProduct = (index: number): Product => {
  const number = String(index).padStart(2, "0");
  const handle = `keyboard-${number}`;
  const title = `Keyboard ${number}`;

  return {
    id: `gid://shopify/Product/${1000 + index}`,
    handle,
    availableForSale: true,
    title,
    description: "Keyboard-only post for local mock.",
    descriptionHtml: `<p>Keyboard-only post #${number}. Image first, quiet detail second.</p>`,
    options: [
      {
        id: `opt-${number}`,
        name: "Layout",
        values: ["60%", "65%", "75%"],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: "29800", currencyCode: "JPY" },
      minVariantPrice: { amount: "29800", currencyCode: "JPY" },
    },
    variants: [
      {
        id: `var-${number}`,
        title: "Default",
        availableForSale: true,
        selectedOptions: [{ name: "Layout", value: "75%" }],
        price: { amount: "29800", currencyCode: "JPY" },
      },
    ],
    featuredImage: {
      url: `/mock/keyboard-${number}.svg`,
      altText: title,
      width: 800,
      height: 800,
    },
    images: [
      {
        url: `/mock/keyboard-${number}.svg`,
        altText: title,
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title,
      description: "Mock keyboard post.",
    },
    tags: ["mock", "keyboard"],
    updatedAt: new Date().toISOString(),
  };
};

export const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) =>
  createMockProduct(i + 1),
);
