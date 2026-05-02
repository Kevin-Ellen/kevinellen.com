// tests/src/app-render-context/resolve/body-content/body-content.resolve.app-render-context.test.ts

import { resolveBodyContentAppRenderContext } from "@app-render-context/resolve/body-content/body-content.resolve.app-render-context";
import { resolveBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";
import { resolveFooterContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/block.resolve.app-render-context",
  () => ({
    resolveBlockContentModuleAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context",
  () => ({
    resolveFooterContentModuleAppRenderContext: jest.fn(),
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
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
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
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "27 May 2025",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    };

    jest
      .mocked(resolveBlockContentModuleAppRenderContext)
      .mockReturnValueOnce(resolvedContentModule as never);

    jest
      .mocked(resolveFooterContentModuleAppRenderContext)
      .mockReturnValueOnce(resolvedFooterModule as never);

    const result = resolveBodyContentAppRenderContext(appContext);

    expect(resolveBlockContentModuleAppRenderContext).toHaveBeenCalledTimes(1);
    expect(resolveBlockContentModuleAppRenderContext).toHaveBeenCalledWith(
      appContext,
      contentModule,
    );

    expect(resolveFooterContentModuleAppRenderContext).toHaveBeenCalledTimes(1);
    expect(resolveFooterContentModuleAppRenderContext).toHaveBeenCalledWith(
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
    expect(resolveFooterContentModuleAppRenderContext).not.toHaveBeenCalled();

    expect(result).toEqual({
      header: appContext.page.content.header,
      content: [],
      footer: [],
    });
  });
});
