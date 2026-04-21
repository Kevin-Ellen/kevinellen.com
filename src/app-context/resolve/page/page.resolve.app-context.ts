// src/app-context/resolve/page/page.resolve.app-context.ts

import type { RoutingResult } from "@request/types/request.types";
import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";
import type { AppContextPublicPageDefinition } from "@shared-types/pages/definitions/public/app-context.public.definition.page.types";
import type { AppContextErrorPageDefinition } from "@shared-types/pages/definitions/error/app-context.base.error.definition.page.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolvePageContent } from "@app-context/resolve/page/content/content.page.resolve.app-context";

const resolvePublicPageAppContext = (
  page: AppStatePublicPageDefinition,
  context: AppContextPageContentResolverContext,
): AppContextPublicPageDefinition => {
  return {
    id: page.id,
    kind: page.kind,
    slug: page.slug,
    label: page.label,
    content: appContextResolvePageContent(page.content, context),
  };
};

const resolveErrorPageAppContext = (
  page: AppStateErrorPageDefinition,
  context: AppContextPageContentResolverContext,
): AppContextErrorPageDefinition => {
  return {
    id: page.id,
    status: page.status,
    metadata: page.metadata,
    content: appContextResolvePageContent(page.content, context),
  };
};

export const resolvePageAppContext = (
  page: AppStatePublicPageDefinition | AppStateErrorPageDefinition,
  routing: RoutingResult,
  context: AppContextPageContentResolverContext,
): AppContextPublicPageDefinition | AppContextErrorPageDefinition => {
  if (routing.kind === "found") {
    return resolvePublicPageAppContext(
      page as AppStatePublicPageDefinition,
      context,
    );
  }

  return resolveErrorPageAppContext(
    page as AppStateErrorPageDefinition,
    context,
  );
};
