// src/app-state/resolve/links/internal-link.resolve.app-state.ts

import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

export const appStateResolveInternalLink = (
  link: AuthoredInternalLink,
): AppStateInternalLink => {
  return {
    ...link,
    svgId: link.svgId ?? null,
    behaviour: link.behaviour ?? {
      openInNewTab: false,
    },
  };
};
