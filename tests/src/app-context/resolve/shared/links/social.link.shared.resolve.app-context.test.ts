// tests/src/app-context/resolve/shared/links/social.link.shared.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";

import { resolveSocialLinkAppContext } from "@app-context/resolve/shared/links/social.link.shared.resolve.app-context";

const makeAppState = (
  social: Record<string, { href: string; label: string }> = {
    github: {
      href: "https://github.com/Kevin-Ellen",
      label: "GitHub",
    },
  },
): AppState =>
  ({
    social,
  }) as unknown as AppState;

const validLink = {
  kind: "social",
  id: "github",
  svgId: "icon-github",
  behaviour: {
    openInNewTab: true,
  },
} as const;

describe("resolveSocialLinkAppContext", () => {
  it("resolves href and text from social config", () => {
    const appState = makeAppState();

    const result = resolveSocialLinkAppContext(validLink, appState);

    expect(result).toEqual({
      ...validLink,
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
    });
  });

  it("preserves link behaviour and svg metadata", () => {
    const appState = makeAppState();

    const result = resolveSocialLinkAppContext(
      {
        kind: "social",
        id: "github",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
      appState,
    );

    expect(result).toEqual({
      kind: "social",
      id: "github",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
    });
  });

  it("throws when the social config entry does not exist", () => {
    const appState = makeAppState({});

    expect(() =>
      resolveSocialLinkAppContext(
        {
          ...validLink,
          id: "missing-social" as never,
        },
        appState,
      ),
    ).toThrow("Missing social config for social link id 'missing-social'.");
  });
});
