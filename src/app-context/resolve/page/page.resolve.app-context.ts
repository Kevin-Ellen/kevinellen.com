// src/app-context/resolve/page/page.resolve.app-context.ts

import type { RoutingResult } from "@request/types/request.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextPageDefinition } from "@shared-types/page-definitions/app-context.page-definition.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolvePageContent } from "@app-context/resolve/page/content/content.page.resolve.app-context";

export const resolvePageAppContext = (
  page: AppStatePageDefinition,
  _routing: RoutingResult,
  context: AppContextPageContentResolverContext,
): AppContextPageDefinition => {
  return {
    id: page.id,
    kind: page.kind,
    slug: page.slug,
    label: page.label,
    status: page.status,
    content: appContextResolvePageContent(page.content, context),
  };
};
