// tests/src/app-state/resolve/page-content/block/list.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInlineContent: jest.fn(),
  }),
);

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";
import {
  appStateResolveListItemBlockContentModule,
  appStateResolveListBlockContentModule,
} from "@app-state/resolve/page-content/block/list.resolve.app-state";

import type {
  AuthoredListItemBlockContentModule,
  AuthoredListBlockContentModule,
} from "@shared-types/page-content/block/list/authored.list.block.page-content.types";
import type {
  AppStateListItemBlockContentModule,
  AppStateListBlockContentModule,
} from "@shared-types/page-content/block/list/app-state.list.block.page-content.types";

const mockedAppStateResolveInlineContent =
  appStateResolveInlineContent as jest.MockedFunction<
    typeof appStateResolveInlineContent
  >;

describe("list AppState resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("appStateResolveListItemBlockContentModule", () => {
    it("maps item inline content through the shared inline resolver", () => {
      const firstInline = {
        kind: "text",
        value: "First",
      } as const;

      const secondInline = {
        kind: "code",
        value: "const answer = 42;",
      } as const;

      const item: AuthoredListItemBlockContentModule = {
        content: [firstInline, secondInline],
      };

      const resolvedFirstInline = {
        kind: "text",
        value: "Resolved first",
      } as const;

      const resolvedSecondInline = {
        kind: "code",
        value: "resolved code",
      } as const;

      mockedAppStateResolveInlineContent
        .mockReturnValueOnce(
          resolvedFirstInline as ReturnType<
            typeof appStateResolveInlineContent
          >,
        )
        .mockReturnValueOnce(
          resolvedSecondInline as ReturnType<
            typeof appStateResolveInlineContent
          >,
        );

      const result = appStateResolveListItemBlockContentModule(item);

      expect(mockedAppStateResolveInlineContent).toHaveBeenCalledTimes(2);
      expect(mockedAppStateResolveInlineContent.mock.calls[0]?.[0]).toBe(
        firstInline,
      );
      expect(mockedAppStateResolveInlineContent.mock.calls[1]?.[0]).toBe(
        secondInline,
      );

      const expected: AppStateListItemBlockContentModule = {
        content: [resolvedFirstInline, resolvedSecondInline],
      };

      expect(result).toEqual(expected);
    });

    it("preserves inline content ordering after resolution", () => {
      const firstInline = {
        kind: "text",
        value: "First",
      } as const;

      const secondInline = {
        kind: "text",
        value: "Second",
      } as const;

      const item: AuthoredListItemBlockContentModule = {
        content: [firstInline, secondInline],
      };

      const resolvedFirst = {
        kind: "text",
        value: "Resolved first",
      } as const;

      const resolvedSecond = {
        kind: "text",
        value: "Resolved second",
      } as const;

      mockedAppStateResolveInlineContent
        .mockReturnValueOnce(
          resolvedFirst as ReturnType<typeof appStateResolveInlineContent>,
        )
        .mockReturnValueOnce(
          resolvedSecond as ReturnType<typeof appStateResolveInlineContent>,
        );

      const result = appStateResolveListItemBlockContentModule(item);

      expect(result.content).toEqual([resolvedFirst, resolvedSecond]);
    });

    it("returns an empty content array unchanged when the item has no inline content", () => {
      const item: AuthoredListItemBlockContentModule = {
        content: [],
      };

      const result = appStateResolveListItemBlockContentModule(item);

      expect(mockedAppStateResolveInlineContent).not.toHaveBeenCalled();
      expect(result).toEqual({
        content: [],
      });
    });
  });

  describe("appStateResolveListBlockContentModule", () => {
    it("defaults style to unordered when omitted", () => {
      const module: AuthoredListBlockContentModule = {
        kind: "list",
        items: [],
      };

      const result = appStateResolveListBlockContentModule(module);

      const expected: AppStateListBlockContentModule = {
        kind: "list",
        style: "unordered",
        items: [],
      };

      expect(result).toEqual(expected);
    });

    it("preserves style when provided", () => {
      const module: AuthoredListBlockContentModule = {
        kind: "list",
        style: "ordered",
        items: [],
      };

      const result = appStateResolveListBlockContentModule(module);

      expect(result.style).toBe("ordered");
    });

    it("maps nested list items through the list item resolver contract", () => {
      const firstInline = {
        kind: "text",
        value: "First item",
      } as const;

      const secondInline = {
        kind: "code",
        value: "const second = true;",
      } as const;

      const module: AuthoredListBlockContentModule = {
        kind: "list",
        items: [
          {
            content: [firstInline],
          },
          {
            content: [secondInline],
          },
        ],
      };

      const resolvedFirstInline = {
        kind: "text",
        value: "Resolved first item",
      } as const;

      const resolvedSecondInline = {
        kind: "code",
        value: "resolved second item",
      } as const;

      mockedAppStateResolveInlineContent
        .mockReturnValueOnce(
          resolvedFirstInline as ReturnType<
            typeof appStateResolveInlineContent
          >,
        )
        .mockReturnValueOnce(
          resolvedSecondInline as ReturnType<
            typeof appStateResolveInlineContent
          >,
        );

      const result = appStateResolveListBlockContentModule(module);

      expect(mockedAppStateResolveInlineContent).toHaveBeenCalledTimes(2);
      expect(mockedAppStateResolveInlineContent.mock.calls[0]?.[0]).toBe(
        firstInline,
      );
      expect(mockedAppStateResolveInlineContent.mock.calls[1]?.[0]).toBe(
        secondInline,
      );

      const expected: AppStateListBlockContentModule = {
        kind: "list",
        style: "unordered",
        items: [
          {
            content: [resolvedFirstInline],
          },
          {
            content: [resolvedSecondInline],
          },
        ],
      };

      expect(result).toEqual(expected);
    });

    it("preserves item ordering after resolution", () => {
      const firstInline = {
        kind: "text",
        value: "First item",
      } as const;

      const secondInline = {
        kind: "text",
        value: "Second item",
      } as const;

      const module: AuthoredListBlockContentModule = {
        kind: "list",
        items: [
          {
            content: [firstInline],
          },
          {
            content: [secondInline],
          },
        ],
      };

      const resolvedFirstInline = {
        kind: "text",
        value: "Resolved first item",
      } as const;

      const resolvedSecondInline = {
        kind: "text",
        value: "Resolved second item",
      } as const;

      mockedAppStateResolveInlineContent
        .mockReturnValueOnce(
          resolvedFirstInline as ReturnType<
            typeof appStateResolveInlineContent
          >,
        )
        .mockReturnValueOnce(
          resolvedSecondInline as ReturnType<
            typeof appStateResolveInlineContent
          >,
        );

      const result = appStateResolveListBlockContentModule(module);

      expect(result.items).toEqual([
        {
          content: [resolvedFirstInline],
        },
        {
          content: [resolvedSecondInline],
        },
      ]);
    });

    it("returns the expected AppState list shape", () => {
      const inline = {
        kind: "text",
        value: "Only item",
      } as const;

      const module: AuthoredListBlockContentModule = {
        kind: "list",
        style: "ordered",
        items: [
          {
            content: [inline],
          },
        ],
      };

      const resolvedInline = {
        kind: "text",
        value: "Resolved only item",
      } as const;

      mockedAppStateResolveInlineContent.mockReturnValue(
        resolvedInline as ReturnType<typeof appStateResolveInlineContent>,
      );

      const result = appStateResolveListBlockContentModule(module);

      const expected: AppStateListBlockContentModule = {
        kind: "list",
        style: "ordered",
        items: [
          {
            content: [resolvedInline],
          },
        ],
      };

      expect(result).toEqual(expected);
    });
  });
});
