// src/app-context/resolve/shared/links/social.link.shared.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextExternalLink } from "@shared-types/links/app-context.links.types";
import type { AppStateSocialLink } from "@shared-types/links/app-state.links.types";

export const appContextResolveSocialLink = (
  link: AppStateSocialLink,
  appState: AppState,
): AppContextExternalLink => {
  const socialEntry = appState.social[link.id];

  if (!socialEntry) {
    throw new Error(`Missing social config for social link id '${link.id}'.`);
  }

  return {
    ...link,
    kind: "external",
    href: socialEntry.href,
    text: socialEntry.label,
  };
};
