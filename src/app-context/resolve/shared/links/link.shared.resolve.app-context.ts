// src/app-context/resolve/shared/links/link.shared.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type {
  AppStateLink,
  AppStateInternalLink,
  AppStateExternalLink,
  AppStateSocialLink,
} from "@shared-types/links/app-state.links.types";
import type { AppContextLink } from "@shared-types/links/app-context.links.types";

import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";
import { resolveExternalLinkAppContext } from "@app-context/resolve/shared/links/external.link.shared.resolve.app-context";
import { resolveSocialLinkAppContext } from "@app-context/resolve/shared/links/social.link.shared.resolve.app-context";

type AppContextLinkResolverRegistry = {
  internal: (link: AppStateInternalLink, appState: AppState) => AppContextLink;
  external: (link: AppStateExternalLink, appState: AppState) => AppContextLink;
  social: (link: AppStateSocialLink, appState: AppState) => AppContextLink;
};

const APP_CONTEXT_LINK_TYPE_REGISTRY: AppContextLinkResolverRegistry = {
  internal: resolveInternalLinkAppContext,
  external: resolveExternalLinkAppContext,
  social: resolveSocialLinkAppContext,
};

export const resolveLinkAppContext = (
  link: AppStateLink,
  appState: AppState,
): AppContextLink => {
  const resolver = APP_CONTEXT_LINK_TYPE_REGISTRY[link.kind];

  return resolver(link as never, appState);
};
