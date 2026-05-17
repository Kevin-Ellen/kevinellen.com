// src/app-context/resolve/page-content/inline/emphasis.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.types";

import { appContextResolveEmphasisInline } from "@app-context/resolve/page-content/inline/emphasis.resolve.app-context";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/inline/inline.resolve.app-context",
  () => ({
    appContextResolveInline: jest.fn(),
  }),
);

describe("appContextResolveEmphasisInlineContent", () => {
  const mockedAppContextResolveInline = jest.mocked(appContextResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves nested inline content", () => {
    const context = {} as AppContextPageContentResolverContext;

    const content: AppStateEmphasisInline = {
      kind: "emphasis",
      content: [
        {
          kind: "text",
          value: "Important",
        },
      ],
    };

    mockedAppContextResolveInline.mockReturnValue({
      kind: "text",
      value: "Important",
    });

    const result = appContextResolveEmphasisInline(content, context);

    expect(result).toEqual({
      kind: "emphasis",
      content: [
        {
          kind: "text",
          value: "Important",
        },
      ],
    });

    expect(mockedAppContextResolveInline).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveInline).toHaveBeenCalledWith(
      content.content[0],
      context,
    );
  });

  it("preserves empty nested content", () => {
    const context = {} as AppContextPageContentResolverContext;

    const content: AppStateEmphasisInline = {
      kind: "emphasis",
      content: [],
    };

    expect(appContextResolveEmphasisInline(content, context)).toEqual({
      kind: "emphasis",
      content: [],
    });

    expect(mockedAppContextResolveInline).not.toHaveBeenCalled();
  });
});
