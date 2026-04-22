// src/app-context/resolve/shared/links/internal.link.shared.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

const resolvePublicPageHref = (
  link: AppStateInternalLink,
  appState: AppState,
): { href: string; text: string } => {
  const page = appState.getPublicPageById(link.id);

  if (!page) {
    throw new Error(`Missing public page for internal link id '${link.id}'.`);
  }

  if (page.slug === null) {
    throw new Error(`Public page '${link.id}' is missing a slug.`);
  }

  return {
    href: page.slug,
    text: page.label,
  };
};

export const resolveInternalLinkAppContext = (
  link: AppStateInternalLink,
  appState: AppState,
): AppContextInternalLink => {
  if (!link || link.id == null) {
    throw new Error(`Invalid AppStateInternalLink: ${JSON.stringify(link)}`);
  }

  const { href, text } = resolvePublicPageHref(link, appState);

  return {
    ...link,
    href,
    text,
  };
};
