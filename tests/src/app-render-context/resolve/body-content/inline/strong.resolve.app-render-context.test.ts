// tests/src/app-render-context/resolve/body-content/inline/strong.resolve.app-render-context.test.ts

import { resolveStrongInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/strong.resolve.app-render-context";
import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.page-content.types";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    resolveInlineContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("resolveStrongInlineContentAppRenderContext", () => {
  it("resolves nested inline content", () => {
    const appContext = {} as AppContext;

    const nestedItem = {
      kind: "text",
      value: "strong",
    };

    const resolvedNestedItem = {
      kind: "text",
      value: "resolved strong",
    };

    const module = {
      kind: "strong",
      content: [nestedItem],
    } as unknown as AppContextStrongInlineContent;

    jest
      .mocked(resolveInlineContentModuleAppRenderContext)
      .mockReturnValue(resolvedNestedItem as never);

    const result = resolveStrongInlineContentAppRenderContext(
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
