// src/app-state/resolve/links/external.link.resolve.app-state.ts

import type { AuthoredExternalLink } from "@shared-types/links/authored.links.types";
import type { AppStateExternalLink } from "@shared-types/links/app-state.links.types";

export const appStateResolveExternalLink = (
  link: AuthoredExternalLink,
): AppStateExternalLink => {
  return {
    kind: "external",
    href: link.href,
    text: link.text,
    svgId: link.svgId ?? null,
    behaviour: {
      openInNewTab: true,
    },
  };
};
