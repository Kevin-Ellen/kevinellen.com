// tests/src/app-render-context/resolve/body-content/body-content.resolve.app-render-context.test.ts

import { resolveBodyContentAppRenderContext } from "@app-render-context/resolve/body-content/body-content.resolve.app-render-context";
import { resolveBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/block.resolve.app-render-context",
  () => ({
    resolveBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

describe("resolveBodyContentAppRenderContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("resolves body content header, content modules, and footer modules", () => {
    const contentModule = {
      kind: "paragraph",
      content: [],
    };

    const footerModule = {
      kind: "quote",
      content: [],
    };

    const appContext = {
      page: {
        content: {
          header: {
            eyebrow: "Kevin Ellen",
            title: "About",
            intro: "A personal platform.",
          },
          content: [contentModule],
          footer: [footerModule],
        },
      },
    } as unknown as AppContext;

    const resolvedContentModule = {
      kind: "paragraph",
      content: [{ kind: "text", value: "Resolved content" }],
    };

    const resolvedFooterModule = {
      kind: "quote",
      content: [{ kind: "text", value: "Resolved footer" }],
    };

    jest
      .mocked(resolveBlockContentModuleAppRenderContext)
      .mockReturnValueOnce(resolvedContentModule as never)
      .mockReturnValueOnce(resolvedFooterModule as never);

    const result = resolveBodyContentAppRenderContext(appContext);

    expect(resolveBlockContentModuleAppRenderContext).toHaveBeenNthCalledWith(
      1,
      appContext,
      contentModule,
    );

    expect(resolveBlockContentModuleAppRenderContext).toHaveBeenNthCalledWith(
      2,
      appContext,
      footerModule,
    );

    expect(result).toEqual({
      header: appContext.page.content.header,
      content: [resolvedContentModule],
      footer: [resolvedFooterModule],
    });
  });

  it("handles empty content and footer module arrays", () => {
    const appContext = {
      page: {
        content: {
          header: {
            eyebrow: null,
            title: "Empty page",
            intro: null,
          },
          content: [],
          footer: [],
        },
      },
    } as unknown as AppContext;

    const result = resolveBodyContentAppRenderContext(appContext);

    expect(resolveBlockContentModuleAppRenderContext).not.toHaveBeenCalled();

    expect(result).toEqual({
      header: appContext.page.content.header,
      content: [],
      footer: [],
    });
  });
});
