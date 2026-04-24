// tests/src/app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context.test.ts

import { resolveParagraphBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context";
import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.page-content.types";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    resolveInlineContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("resolveParagraphBlockContentModuleAppRenderContext", () => {
  const appContext = {} as AppContext;

  it("resolves inline content inside a paragraph", () => {
    const inlineItem = {
      kind: "text",
      value: "Paragraph text",
    };

    const resolvedInlineItem = {
      kind: "text",
      value: "Resolved paragraph text",
    };

    const module = {
      kind: "paragraph",
      content: [inlineItem],
    } as unknown as AppContextParagraphBlockContentModule;

    jest
      .mocked(resolveInlineContentModuleAppRenderContext)
      .mockReturnValue(resolvedInlineItem as never);

    const result = resolveParagraphBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(resolveInlineContentModuleAppRenderContext).toHaveBeenCalledWith(
      appContext,
      inlineItem,
    );

    expect(result).toEqual({
      ...module,
      content: [resolvedInlineItem],
    });
  });
});
