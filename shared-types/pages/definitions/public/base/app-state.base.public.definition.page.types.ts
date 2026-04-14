// shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types.ts

import type { AuthoredBasePublicPageDefinition } from "@shared-types/pages/definitions/public/base/authored.base.public.definition.page.types";
import type { AppStatePageRobotsDirectives } from "@shared-types/pages/shared/app-state.robots.shared.page.types";

import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";
import type { AppStateStructuredDataEntry } from "@shared-types/structured-data/app-state.structured-data.types";
import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";
import type { AppStateRobotsTxt } from "@shared-types/pages/public/robots-txt/app-state.robots-txt.public.page.types";
import type { AppStateSitemapXml } from "@shared-types/pages/public/sitemap-xml/app-state.sitemap-xml.public.page.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStatePublicBasePageDefinitionDeterministicFields = Readonly<{
  robots: AppStatePageRobotsDirectives;
  assets: AppStateAssets;
  breadcrumbs: readonly PageIdPublic[];
  structuredData: readonly AppStateStructuredDataEntry[];
  robotsTxt: AppStateRobotsTxt;
  sitemapXml: AppStateSitemapXml;
  content: AppStatePageContent;
}>;

export type AppStatePublicBasePageDefinition = Replace<
  AuthoredBasePublicPageDefinition,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
