// src/app-state/resolve/links/link.resolve.app-state.ts

import type {
  AuthoredExternalLink,
  AuthoredInternalLink,
  AuthoredLink,
  AuthoredSocialLink,
} from "@shared-types/links/authored.links.types";
import type { AppStateLink } from "@shared-types/links/app-state.links.types";

import { appStateResolveExternalLink } from "@app-state/resolve/links/external.link.resolve.app-state";
import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";
import { appStateResolveSocialLink } from "@app-state/resolve/links/social.link.resolve.app-state";

type AppStateLinkResolverRegistry = {
  internal: (link: AuthoredInternalLink) => AppStateLink;
  external: (link: AuthoredExternalLink) => AppStateLink;
  social: (link: AuthoredSocialLink) => AppStateLink;
};

const APP_STATE_LINK_TYPE_REGISTRY: AppStateLinkResolverRegistry = {
  internal: appStateResolveInternalLink,
  external: appStateResolveExternalLink,
  social: appStateResolveSocialLink,
};

export const resolveLinkAppState = (link: AuthoredLink): AppStateLink => {
  const resolver = APP_STATE_LINK_TYPE_REGISTRY[link.kind];

  return resolver(link as never);
};
