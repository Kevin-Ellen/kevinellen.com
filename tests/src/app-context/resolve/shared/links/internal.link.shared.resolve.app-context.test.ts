// tests/src/app-context/resolve/shared/links/internal.link.shared.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";

import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";

const makeAppState = (
  page: unknown = {
    id: "about",
    label: "About",
    slug: "/about",
  },
): AppState =>
  ({
    getPublicPageById: jest.fn().mockReturnValue(page),
  }) as unknown as AppState;

const validLink = {
  kind: "internal",
  id: "about",
  svgId: null,
  behaviour: {
    openInNewTab: false,
  },
} as const;

describe("resolveInternalLinkAppContext", () => {
  it("resolves href and text from the linked public page", () => {
    const appState = makeAppState();

    const result = resolveInternalLinkAppContext(validLink, appState);

    expect(appState.getPublicPageById).toHaveBeenCalledWith("about");

    expect(result).toEqual({
      ...validLink,
      href: "/about",
      text: "About",
    });
  });

  it("preserves link behaviour and svg metadata", () => {
    const appState = makeAppState();

    const result = resolveInternalLinkAppContext(
      {
        kind: "internal",
        id: "about",
        svgId: "icon-home",
        behaviour: {
          openInNewTab: true,
        },
      },
      appState,
    );

    expect(result).toEqual({
      kind: "internal",
      id: "about",
      svgId: "icon-home",
      behaviour: {
        openInNewTab: true,
      },
      href: "/about",
      text: "About",
    });
  });

  it("throws when the link is null", () => {
    const appState = makeAppState();

    expect(() =>
      resolveInternalLinkAppContext(null as never, appState),
    ).toThrow("Invalid AppStateInternalLink: null");
  });

  it("throws when the link id is null", () => {
    const appState = makeAppState();

    const invalidLink = {
      kind: "internal",
      id: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    expect(() =>
      resolveInternalLinkAppContext(invalidLink as never, appState),
    ).toThrow(`Invalid AppStateInternalLink: ${JSON.stringify(invalidLink)}`);
  });

  it("throws when the linked public page does not exist", () => {
    const appState = makeAppState(null);

    expect(() =>
      resolveInternalLinkAppContext(
        {
          ...validLink,
          id: "missing-page" as never,
        },
        appState,
      ),
    ).toThrow("Missing public page for internal link id 'missing-page'.");
  });

  it("throws when the linked public page is missing a slug", () => {
    const appState = makeAppState({
      id: "about",
      label: "About",
      slug: null,
    });

    expect(() => resolveInternalLinkAppContext(validLink, appState)).toThrow(
      "Public page 'about' is missing a slug.",
    );
  });

  it("throws when the linked public page is missing a label", () => {
    const appState = makeAppState({
      id: "about",
      label: null,
      slug: "/about",
    });

    expect(() => resolveInternalLinkAppContext(validLink, appState)).toThrow(
      "Public page 'about' is missing a label.",
    );
  });
});
