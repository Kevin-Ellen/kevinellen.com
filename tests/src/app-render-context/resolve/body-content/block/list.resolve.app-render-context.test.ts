// tests/src/app-render-context/resolve/body-content/block/list.resolve.app-render-context.test.ts

import { resolveListBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/list.resolve.app-render-context";
import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextListBlockContentModule } from "@shared-types/page-content/block/list/app-context.list.block.page-content.types";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    resolveInlineContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("resolveListBlockContentModuleAppRenderContext", () => {
  const appContext = {} as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves inline content inside list items", () => {
    const inlineItem = {
      kind: "text",
      value: "List item",
    };

    const resolvedInlineItem = {
      kind: "text",
      value: "Resolved list item",
    };

    const module = {
      kind: "list",
      ordered: false,
      items: [
        {
          content: [inlineItem],
        },
      ],
    } as unknown as AppContextListBlockContentModule;

    jest
      .mocked(resolveInlineContentModuleAppRenderContext)
      .mockReturnValue(resolvedInlineItem as never);

    const result = resolveListBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(resolveInlineContentModuleAppRenderContext).toHaveBeenCalledWith(
      appContext,
      inlineItem,
    );

    expect(result).toEqual({
      ...module,
      items: [
        {
          content: [resolvedInlineItem],
        },
      ],
    });
  });

  it("handles empty list items", () => {
    const module = {
      kind: "list",
      ordered: false,
      items: [],
    } as unknown as AppContextListBlockContentModule;

    const result = resolveListBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(resolveInlineContentModuleAppRenderContext).not.toHaveBeenCalled();
    expect(result).toEqual(module);
  });
});
