// tests/src/app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context.test.ts

import { resolveEmphasisInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context";
import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.page-content.types";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    resolveInlineContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("resolveEmphasisInlineContentAppRenderContext", () => {
  it("resolves nested inline content", () => {
    const appContext = {} as AppContext;

    const nestedItem = {
      kind: "text",
      value: "emphasised",
    };

    const resolvedNestedItem = {
      kind: "text",
      value: "resolved emphasised",
    };

    const module = {
      kind: "emphasis",
      content: [nestedItem],
    } as unknown as AppContextEmphasisInlineContent;

    jest
      .mocked(resolveInlineContentModuleAppRenderContext)
      .mockReturnValue(resolvedNestedItem as never);

    const result = resolveEmphasisInlineContentAppRenderContext(
      appContext,
      module,
    );

    expect(resolveInlineContentModuleAppRenderContext).toHaveBeenCalledWith(
      appContext,
      nestedItem,
    );

    expect(result).toEqual({
      ...module,
      content: [resolvedNestedItem],
    });
  });
});
