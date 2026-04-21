// shared-types/breadcrumbs/app-render-context.breadcrumbs.types.ts

import type { AppContextBreadcrumbs } from "@shared-types/breadcrumbs/app-context.breadcrumbs.types";
import type { AppRenderContextInternalLink } from "@shared-types/links/app-render-context.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextBreadcrumbsDeterministicFields = Readonly<{
  items: readonly AppRenderContextInternalLink[];
}>;

export type AppRenderContextBreadcrumbs = Replace<
  AppContextBreadcrumbs,
  AppRenderContextBreadcrumbsDeterministicFields
>;
