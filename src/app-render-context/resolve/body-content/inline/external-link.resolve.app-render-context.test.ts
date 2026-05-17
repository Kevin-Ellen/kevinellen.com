// src/app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.types";

import { appRenderContextResolveExternalLinkInline } from "@app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  appRenderContextResolveLink: jest.fn(),
}));

describe("appRenderContextResolveExternalLinkInline", () => {
  const mockedAppRenderContextResolveLink = jest.mocked(
    appRenderContextResolveLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves an external link inline into a render-safe link", () => {
    const link = {
      id: "example",
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    };

    const resolvedLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      openInNewTab: true,
      svg: null,
    };

    mockedAppRenderContextResolveLink.mockReturnValue(resolvedLink as never);

    const inline: AppContextExternalLinkInline = {
      kind: "externalLink",
      link: link as never,
    };

    const appContext = {} as unknown as AppContext;

    expect(
      appRenderContextResolveExternalLinkInline(appContext, inline),
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
