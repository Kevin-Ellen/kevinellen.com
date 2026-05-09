// src/app-context/resolve/page-content/inline/strong.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateStrongInline } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.types";

import { appContextResolveStrongInline } from "@app-context/resolve/page-content/inline/strong.resolve.app-context";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/inline/inline.resolve.app-context",
  () => ({
    appContextResolveInline: jest.fn(),
  }),
);

describe("appContextResolveStrongInline", () => {
  const mockedAppContextResolveInline = jest.mocked(appContextResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves nested inline content", () => {
    const context = {} as AppContextPageContentResolverContext;

    const content: AppStateStrongInline = {
      kind: "strong",
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

    const result = appContextResolveStrongInline(content, context);

    expect(result).toEqual({
      kind: "strong",
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

    const content: AppStateStrongInline = {
      kind: "strong",
      content: [],
    };

    const result = appContextResolveStrongInline(content, context);

    expect(result).toEqual({
      kind: "strong",
      content: [],
    });

    expect(mockedAppContextResolveInline).not.toHaveBeenCalled();
  });
});
