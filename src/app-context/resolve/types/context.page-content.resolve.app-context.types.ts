// src/app-context/resolve/page/content/context.page-content.resolve.app-context.types.ts

import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

export type AppContextPageContentResolverContext = Readonly<{
  resolveInternalLink: (link: AppStateInternalLink) => AppContextInternalLink;
}>;
