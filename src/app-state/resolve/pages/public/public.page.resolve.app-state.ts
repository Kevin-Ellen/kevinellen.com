// src/app-state/resolve/pages/public/public.page.resolve.app-state.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { appStateResolvePageRobots } from "@app-state/resolve/pages/public/robots.resolve.app-state";
import { appStateResolvePageAssets } from "@app-state/resolve/pages/public/assets.resolve.app-state";
import { appStateResolvePageBreadcrumbs } from "@app-state/resolve/pages/public/breadcrumbs.resolve.app-state";
import { appStateResolvePageStructuredData } from "@app-state/resolve/pages/public/structured-data.resolve.app-state";
import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";
import { appStateResolvePageRobotsTxT } from "@app-state/resolve/pages/public/robots-txt.resolve.app-state";
import { appStateResolvePageSitemapXml } from "@app-state/resolve/pages/public/sitemap-xml.resolve.app-state";

export const appStateResolvePublicPage = (
  page: AuthoredPublicPageDefinition,
): AppStatePageDefinition => {
  return {
    ...page,
    status: null,
    robots: appStateResolvePageRobots(page.robots),
    assets: appStateResolvePageAssets(page.assets),
    breadcrumbs: appStateResolvePageBreadcrumbs(page.breadcrumbs),
    structuredData: appStateResolvePageStructuredData(page.structuredData),
    robotsTxt: appStateResolvePageRobotsTxT(page.robotsTxt),
    sitemapXml: appStateResolvePageSitemapXml(page.sitemapXml),
    content: appStateResolvePageContent(page.content),
  };
};
