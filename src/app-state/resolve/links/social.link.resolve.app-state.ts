// src/app-state/resolve/links/social.link.resolve.app-state.ts

import type { AuthoredSocialLink } from "@shared-types/links/authored.links.types";
import type { AppStateSocialLink } from "@shared-types/links/app-state.links.types";

export const appStateResolveSocialLink = (
  link: AuthoredSocialLink,
): AppStateSocialLink => {
  return {
    kind: "social",
    id: link.id,
    svgId: link.svgId ?? null,
    behaviour: {
      openInNewTab: true,
    },
  };
};
