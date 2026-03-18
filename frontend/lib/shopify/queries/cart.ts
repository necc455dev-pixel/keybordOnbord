import KeyBoardFragment from "../fragments/keyboard";

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${KeyBoardFragment}
`;
