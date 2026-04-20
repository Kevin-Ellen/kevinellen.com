// src/app-context/resolve/shared/links/social.link.shared.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextSocialLink } from "@shared-types/links/app-context.links.types";
import type { AppStateSocialLink } from "@shared-types/links/app-state.links.types";

export const resolveSocialLinkAppContext = (
  link: AppStateSocialLink,
  appState: AppState,
): AppContextSocialLink => {
  const socialEntry = appState.social[link.id];

  if (!socialEntry) {
    throw new Error(`Missing social config for social link id '${link.id}'.`);
  }

  return {
    ...link,
    href: socialEntry.href,
    text: socialEntry.label,
  };
};
