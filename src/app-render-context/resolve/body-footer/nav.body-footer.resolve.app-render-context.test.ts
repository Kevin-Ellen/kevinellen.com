// src/app-render-context/resolve/body-footer/nav.body-footer.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyFooterNav } from "@app-render-context/resolve/body-footer/nav.body-footer.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  appRenderContextResolveLink: jest.fn(),
}));

describe("appRenderContextResolveBodyFooterNav", () => {
  const mockedAppRenderContextResolveLink = jest.mocked(
    appRenderContextResolveLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves footer navigation sections and links", () => {
    const sourceLink = {
      id: "journal",
      kind: "internal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const resolvedLink = {
      kind: "internal",
      href: "/journal",
      text: "Journal",
      openInNewTab: false,
      svg: null,
    };

    mockedAppRenderContextResolveLink.mockReturnValue(resolvedLink as never);

    const appContext = {
      navigation: {
        footer: {
          sections: [
            {
              id: "content",
              label: "Content",
              items: [sourceLink],
            },
          ],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyFooterNav(appContext)).toEqual({
      sections: [
        {
          id: "content",
          label: "Content",
          items: [resolvedLink],
        },
      ],
    });

    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledWith(
      appContext,
      sourceLink,
    );
  });

  it("preserves empty footer navigation sections", () => {
    const appContext = {
      navigation: {
        footer: {
          sections: [],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyFooterNav(appContext)).toEqual({
      sections: [],
    });

    expect(mockedAppRenderContextResolveLink).not.toHaveBeenCalled();
  });
});
