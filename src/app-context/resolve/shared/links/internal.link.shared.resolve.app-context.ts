// src/app-context/resolve/shared/links/internal.link.shared.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

export const resolveInternalLinkAppContext = (
  link: AppStateInternalLink,
  appState: AppState,
): AppContextInternalLink => {
  const page = appState.getPublicPageById(link.id);

  if (!page) {
    throw new Error(`Missing public page for internal link id '${link.id}'.`);
  }

  return {
    ...link,
    href: page.slug,
    text: page.label,
  };
};
