// src/app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.types";

import { appRenderContextResolveInternalLinkInline } from "@app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  appRenderContextResolveLink: jest.fn(),
}));

describe("appRenderContextResolveInternalLinkInline", () => {
  const mockedAppRenderContextResolveLink = jest.mocked(
    appRenderContextResolveLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves an internal link inline into a render-safe link", () => {
    const link = {
      id: "journal-entry",
      kind: "internal",
      href: "/journal/coot-entry",
      text: "Coot field notes",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const resolvedLink = {
      kind: "internal",
      href: "/journal/coot-entry",
      text: "Coot field notes",
      openInNewTab: false,
      svg: null,
    };

    mockedAppRenderContextResolveLink.mockReturnValue(resolvedLink as never);

    const inline: AppContextInternalLinkInline = {
      kind: "internalLink",
      link: link as never,
    };

    const appContext = {} as unknown as AppContext;

    expect(
      appRenderContextResolveInternalLinkInline(appContext, inline),
    ).toEqual({
      kind: "link",
      link: resolvedLink,
    });

    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledTimes(1);

    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledWith(
      appContext,
      link,
    );
  });
});
