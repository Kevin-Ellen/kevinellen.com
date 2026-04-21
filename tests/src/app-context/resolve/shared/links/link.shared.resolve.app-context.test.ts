// tests/src/app-context/resolve/shared/links/link.shared.resolve.app-context.test.ts

import { resolveLinkAppContext } from "@app-context/resolve/shared/links/link.shared.resolve.app-context";
import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";
import { resolveExternalLinkAppContext } from "@app-context/resolve/shared/links/external.link.shared.resolve.app-context";
import { resolveSocialLinkAppContext } from "@app-context/resolve/shared/links/social.link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context",
  () => ({
    resolveInternalLinkAppContext: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/shared/links/external.link.shared.resolve.app-context",
  () => ({
    resolveExternalLinkAppContext: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/shared/links/social.link.shared.resolve.app-context",
  () => ({
    resolveSocialLinkAppContext: jest.fn(),
  }),
);

describe("resolveLinkAppContext", () => {
  const mockedResolveInternalLinkAppContext = jest.mocked(
    resolveInternalLinkAppContext,
  );
  const mockedResolveExternalLinkAppContext = jest.mocked(
    resolveExternalLinkAppContext,
  );
  const mockedResolveSocialLinkAppContext = jest.mocked(
    resolveSocialLinkAppContext,
  );

  const appState = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches internal links to the internal resolver", () => {
    const link = {
      kind: "internal",
      id: "about",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    } as const;

    const resolved = {
      ...link,
      href: "/about",
      text: "About",
    };

    mockedResolveInternalLinkAppContext.mockReturnValue(resolved);

    const result = resolveLinkAppContext(link, appState);

    expect(result).toBe(resolved);
    expect(mockedResolveInternalLinkAppContext).toHaveBeenCalledWith(
      link,
      appState,
    );
  });

  it("dispatches external links to the external resolver", () => {
    const link = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    } as const;

    const resolved = {
      ...link,
    };

    mockedResolveExternalLinkAppContext.mockReturnValue(resolved);

    const result = resolveLinkAppContext(link, appState);

    expect(result).toBe(resolved);
    expect(mockedResolveExternalLinkAppContext).toHaveBeenCalledWith(
      link,
      appState,
    );
  });

  it("dispatches social links to the social resolver", () => {
    const link = {
      kind: "social",
      id: "github",
      svgId: "icon-github",
      behaviour: {
        openInNewTab: true,
      },
    } as const;

    const resolved = {
      ...link,
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
    };

    mockedResolveSocialLinkAppContext.mockReturnValue(resolved);

    const result = resolveLinkAppContext(link, appState);

    expect(result).toBe(resolved);
    expect(mockedResolveSocialLinkAppContext).toHaveBeenCalledWith(
      link,
      appState,
    );
  });
});
