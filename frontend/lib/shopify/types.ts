// Core optional helper. We keep it explicit to surface "unknown" vs "absent".
export type Maybe<T> = T | null;

// Graph-style pagination for Shopify collections and our feeds.
export type Connection<T> = {
  edges: Array<Edge<T>>;
};

// Minimal edge; we avoid extra metadata to keep payloads slim.
export type Edge<T> = {
  node: T;
};

// Service belief: the cart is only a means to share and ship keyboards,
// not the center of the experience. We keep it lean.
export type KeyBoard = Omit<ShopifyKeyBoard, "lines"> & {
  lines: KeyBoardItem[];
};

// A person in the community. Identity is light-weight and respectful.
export type User = {
  id: string;
  name: string;
  country: string;
};

// Makers are credited first-class. Attribution is non-negotiable.
export type Maker = User & {
  link: string;
};

// A "product" doubles as a post: a single keyboard image, nothing else.
// We bias toward the photo, and let details be optional and human.
export type KeyBoardProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
  uploadedAt: string; // ISO string; time-based feeds matter more than algorithms.
  madeBy: User; // Who posted the image (can be the owner or a curator).
  maker: Maker; // Who built the keyboard (credit is explicit).
  // We keep tags simple to keep the community focused on keyboards only.
  tags?: string[];
};

// A line item is a proof of intent: "I want this keyboard".
export type KeyBoardItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: KeyBoardProduct;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

// The image is the product. We store dimensions for better layout fidelity.
export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

// Navigation stays small; there are no "infinite categories".
export type Menu = {
  title: string;
  path: string;
};

// Currency is explicit. Keyboard culture is global.
export type Money = {
  amount: string;
  currencyCode: string;
};

// Editorial pages are for philosophy, maker spotlights, and safety notes.
export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

// We keep Shopify's product model but prioritize the single hero image.
export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  variants: ProductVariant[];
  images: Image[];
};

// Options exist, but the feed is not about endless configurators.
export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

// Variants are allowed, but they should not dominate the experience.
export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

// SEO is optional; the community comes first.
export type SEO = {
  title: string;
  description: string;
};

// Shopify cart abstraction. "KeyBoard" is our domain name for it.
export type ShopifyKeyBoard = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<KeyBoardItem>;
  totalQuantity: number;
};

// Collections are minimal: we only use them to curate themes.
export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

// Shopify product shape. We keep it for compatibility with the API.
export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

// ---- Shopify operations ----
export type ShopifyKeyBoardOperation = {
  data: {
    cart: ShopifyKeyBoard;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateKeyBoardOperation = {
  data: { cartCreate: { cart: ShopifyKeyBoard } };
};

export type ShopifyAddToKeyBoardOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyKeyBoard;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromKeyBoardOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyKeyBoard;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateKeyBoardOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyKeyBoard;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};
