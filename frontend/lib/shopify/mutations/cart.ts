import KeyBoardFragment from "../fragments/keyboard";

export const addToKeyBoardMutation = /* GraphQL */ `
  mutation addToKeyBoard($KeyBoardId: ID!, $lines: [KeyBoardLineInput!]!) {
    KeyBoardLinesAdd(KeyBoardId: $KeyBoardId, lines: $lines) {
      KeyBoard {
        ...KeyBoard
      }
    }
  }
  ${KeyBoardFragment}
`;

export const createKeyBoardMutation = /* GraphQL */ `
  mutation createKeyBoard($lineItems: [KeyBoardLineInput!]) {
    KeyBoardCreate(input: { lines: $lineItems }) {
      KeyBoard {
        ...KeyBoard
      }
    }
  }
  ${KeyBoardFragment}
`;

export const editKeyBoardItemsMutation = /* GraphQL */ `
  mutation editKeyBoardItems(
    $KeyBoardId: ID!
    $lines: [KeyBoardLineUpdateInput!]!
  ) {
    KeyBoardLinesUpdate(KeyBoardId: $KeyBoardId, lines: $lines) {
      KeyBoard {
        ...KeyBoard
      }
    }
  }
  ${KeyBoardFragment}
`;

export const removeFromKeyBoardMutation = /* GraphQL */ `
  mutation removeFromKeyBoard($KeyBoardId: ID!, $lineIds: [ID!]!) {
    KeyBoardLinesRemove(KeyBoardId: $KeyBoardId, lineIds: $lineIds) {
      KeyBoard {
        ...KeyBoard
      }
    }
  }
  ${KeyBoardFragment}
`;
