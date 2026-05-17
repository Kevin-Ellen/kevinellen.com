// src/app-state/resolve/pages/error/error.page.resolve.app-state.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/page-definitions/authored.error.page-definition.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";
import { appStateResolvePageMetadata } from "@app-state/resolve/pages/page-metadata.resolve.app-state";

export const appStateResolveErrorPage = (
  page: AuthoredErrorPageDefinition,
): AppStatePageDefinition => {
  return {
    ...page,

    kind: null,
    slug: null,

    metadata: appStateResolvePageMetadata(page.metadata),
    socialPreview: null,

    robots: null,
    robotsTxt: null,
    sitemapXml: null,
    structuredData: [],

    content: appStateResolvePageContent(page.content),
    breadcrumbs: ["home", page.id],

    assets: {
      svg: [],
      scripts: [],
    },
  };
};
