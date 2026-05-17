// shared-types/breadcrumbs/app-context.breadcrumbs.types.ts

import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";

export type AppContextBreadcrumbs = Readonly<{
  items: readonly AppContextInternalLink[];
  current: string;
}>;
