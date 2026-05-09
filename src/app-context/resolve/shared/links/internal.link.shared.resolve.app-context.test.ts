// src/app-context/resolve/shared/links/internal.link.shared.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

import { appContextResolveInternalLink } from "./internal.link.shared.resolve.app-context";

describe("appContextResolveInternalLink", () => {
  it("resolves an internal link using the linked public page", () => {
    const link: AppStateInternalLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appState = {
      getPublicPageById: jest.fn().mockReturnValue({
        id: "journal",
        slug: "/journal",
        label: "Journal",
      }),
    } as unknown as AppState;

    const result = appContextResolveInternalLink(link, appState);

    expect(result).toEqual({
      kind: "internal",
      id: "journal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    });

    expect(appState.getPublicPageById).toHaveBeenCalledWith("journal");
  });

  it("uses explicit link text over the page label", () => {
    const link: AppStateInternalLink = {
      kind: "internal",
      id: "journal",
      text: "Field Notes",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appState = {
      getPublicPageById: jest.fn().mockReturnValue({
        id: "journal",
        slug: "/journal",
        label: "Journal",
      }),
    } as unknown as AppState;

    const result = appContextResolveInternalLink(link, appState);

    expect(result).toEqual({
      kind: "internal",
      id: "journal",
      href: "/journal",
      text: "Field Notes",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    });
  });

  it("throws when the linked public page does not exist", () => {
    const link: AppStateInternalLink = {
      kind: "internal",
      id: "missing-page",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appState = {
      getPublicPageById: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    expect(() => appContextResolveInternalLink(link, appState)).toThrow(
      "Missing public page for internal link id 'missing-page'.",
    );
  });

  it("throws when the linked public page is missing a slug", () => {
    const link: AppStateInternalLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appState = {
      getPublicPageById: jest.fn().mockReturnValue({
        id: "journal",
        slug: null,
        label: "Journal",
      }),
    } as unknown as AppState;

    expect(() => appContextResolveInternalLink(link, appState)).toThrow(
      "Public page 'journal' is missing a slug.",
    );
  });

  it("throws when the linked public page is missing a label", () => {
    const link: AppStateInternalLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appState = {
      getPublicPageById: jest.fn().mockReturnValue({
        id: "journal",
        slug: "/journal",
        label: null,
      }),
    } as unknown as AppState;

    expect(() => appContextResolveInternalLink(link, appState)).toThrow(
      "Public page 'journal' is missing a label.",
    );
  });

  it("throws when the internal link is invalid", () => {
    const appState = {} as AppState;

    expect(() =>
      appContextResolveInternalLink(null as never, appState),
    ).toThrow("Invalid AppStateInternalLink: null");
  });

  it("throws when the internal link id is null", () => {
    const appState = {} as AppState;

    expect(() =>
      appContextResolveInternalLink(
        {
          kind: "internal",
          id: null,
          text: null,
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        } as never,
        appState,
      ),
    ).toThrow(
      `Invalid AppStateInternalLink: ${JSON.stringify({
        kind: "internal",
        id: null,
        text: null,
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      })}`,
    );
  });
});
