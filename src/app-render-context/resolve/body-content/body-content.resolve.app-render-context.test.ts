// src/app-render-context/resolve/body-content/body-content.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextBlock } from "@shared-types/page-content/block/app-context.block.types";
import type { AppContextPageContentFooter } from "@shared-types/page-content/footer/app-context.page-footer.types";

import { appRenderContextResolveBodyContent } from "@app-render-context/resolve/body-content/body-content.resolve.app-render-context";
import { appRenderContextResolveBlock } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";
import { appRenderContextResolveFooter } from "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/block.resolve.app-render-context",
  () => ({
    appRenderContextResolveBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/footer/footer.resolve.app-render-context",
  () => ({
    appRenderContextResolveFooter: jest.fn(),
  }),
);

describe("appRenderContextResolveBodyContent", () => {
  const mockedAppRenderContextResolveBlock = jest.mocked(
    appRenderContextResolveBlock,
  );

  const mockedAppRenderContextResolveFooter = jest.mocked(
    appRenderContextResolveFooter,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves body content with a visible header", () => {
    const block = {
      kind: "paragraph",
    } as unknown as AppContextBlock;

    const resolvedBlock = {
      kind: "paragraph",
      resolved: true,
    };

    const footer = {
      kind: "journalEntryFooter",
    } as unknown as AppContextPageContentFooter;

    const resolvedFooter = {
      kind: "journalEntryFooter",
      resolved: true,
    };

    mockedAppRenderContextResolveBlock.mockReturnValue(resolvedBlock as never);

    mockedAppRenderContextResolveFooter.mockReturnValue(
      resolvedFooter as never,
    );

    const appContext = {
      page: {
        content: {
          head: {
            title: "Journal",
            eyebrow: "Field Notes",
            intro: "Latest wildlife observations.",
            showInBody: true,
          },
          content: [block],
          footer: [footer],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyContent(appContext)).toEqual({
      header: {
        title: "Journal",
        eyebrow: "Field Notes",
        intro: "Latest wildlife observations.",
        showInBody: true,
      },
      content: [resolvedBlock],
      footer: [resolvedFooter],
    });

    expect(mockedAppRenderContextResolveBlock).toHaveBeenCalledTimes(1);

    expect(mockedAppRenderContextResolveBlock).toHaveBeenCalledWith(
      appContext,
      block,
    );

    expect(mockedAppRenderContextResolveFooter).toHaveBeenCalledTimes(1);

    expect(mockedAppRenderContextResolveFooter).toHaveBeenCalledWith(
      appContext,
      footer,
    );
  });

  it("returns a null header when showInBody is false", () => {
    const appContext = {
      page: {
        content: {
          head: {
            title: "Homepage",
            eyebrow: "Photography Duck",
            intro: "Wildlife and field notes.",
            showInBody: false,
          },
          content: [],
          footer: [],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyContent(appContext)).toEqual({
      header: null,
      content: [],
      footer: [],
    });

    expect(mockedAppRenderContextResolveBlock).not.toHaveBeenCalled();
    expect(mockedAppRenderContextResolveFooter).not.toHaveBeenCalled();
  });
});
