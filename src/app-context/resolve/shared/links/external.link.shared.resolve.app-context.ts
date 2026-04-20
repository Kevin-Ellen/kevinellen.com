// src/app-context/resolve/shared/links/external.link.shared.resolve.app-context.ts

import type { AppContextExternalLink } from "@shared-types/links/app-context.links.types";
import type { AppStateExternalLink } from "@shared-types/links/app-state.links.types";

export const resolveExternalLinkAppContext = (
  link: AppStateExternalLink,
): AppContextExternalLink => {
  return {
    ...link,
  };
};
