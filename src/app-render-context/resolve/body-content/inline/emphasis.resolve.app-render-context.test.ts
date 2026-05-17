// src/app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.types";

import { appRenderContextResolveEmphasisInline } from "@app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context";
import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    appRenderContextResolveInline: jest.fn(),
  }),
);

describe("appRenderContextResolveEmphasisInline", () => {
  const mockedAppRenderContextResolveInline = jest.mocked(
    appRenderContextResolveInline,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves nested inline content", () => {
    const childInline = {
      kind: "text",
      text: "important",
    };

    const resolvedChildInline = {
      kind: "text",
      text: "important",
    };

    mockedAppRenderContextResolveInline.mockReturnValue(
      resolvedChildInline as never,
    );

    const inline: AppContextEmphasisInline = {
      kind: "emphasis",
      content: [childInline as never],
    };

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveEmphasisInline(appContext, inline)).toEqual({
      ...inline,
      content: [resolvedChildInline],
    });

    expect(mockedAppRenderContextResolveInline).toHaveBeenCalledTimes(1);
    expect(mockedAppRenderContextResolveInline).toHaveBeenCalledWith(
      appContext,
      childInline,
    );
  });

  it("returns an empty content array when no nested inline content exists", () => {
    const inline: AppContextEmphasisInline = {
      kind: "emphasis",
      content: [],
    };

    expect(
      appRenderContextResolveEmphasisInline(
        {} as unknown as AppContext,
        inline,
      ),
    ).toEqual({
      ...inline,
      content: [],
    });

    expect(mockedAppRenderContextResolveInline).not.toHaveBeenCalled();
  });
});
