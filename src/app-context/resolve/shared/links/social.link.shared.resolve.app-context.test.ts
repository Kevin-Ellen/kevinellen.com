// src/app-context/resolve/shared/links/social.link.shared.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateSocialLink } from "@shared-types/links/app-state.links.types";

import { appContextResolveSocialLink } from "./social.link.shared.resolve.app-context";

describe("appContextResolveSocialLink", () => {
  it("resolves a social link from app state social config", () => {
    const link: AppStateSocialLink = {
      kind: "social",
      id: "github",
      text: null,
      svgId: "icon-github",
      behaviour: {
        openInNewTab: true,
      },
    };

    const appState = {
      social: {
        github: {
          href: "https://github.com/example",
          label: "GitHub",
        },
      },
    } as AppState;

    const result = appContextResolveSocialLink(link, appState);

    expect(result).toEqual({
      kind: "social",
      id: "github",
      href: "https://github.com/example",
      text: "GitHub",
      svgId: "icon-github",
      behaviour: {
        openInNewTab: true,
      },
    });
  });

  it("throws when the social config entry does not exist", () => {
    const link: AppStateSocialLink = {
      kind: "social",
      id: "github",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    };

    const appState = {
      social: {},
    } as AppState;

    expect(() => appContextResolveSocialLink(link, appState)).toThrow(
      "Missing social config for social link id 'github'.",
    );
  });
});
