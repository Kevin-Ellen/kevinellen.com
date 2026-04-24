// shared-types/page-definitions/app-state.page-definition.types.ts

import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";
import type { AuthoredPageDefinition } from "@shared-types/page-definitions/authored.page-definitions.types";

import type { AppStatePageRobotsDirectives } from "@shared-types/page-definitions/robots/app-state.robots.page-definition.types";
import type { AppStatePageRobotsTxtDirectives } from "@shared-types/page-definitions/robots-txt/app-state.robots-txt.page-definition.types";
import type { AppStatePageSitemapXmlDirectives } from "@shared-types/page-definitions/sitemap-xml/app-state.sitemap-xml.page-definition.types";

import type { ErrorPageStatus } from "@shared-types/page-definitions/shared/shared.error.page-definition.types";
import type { PageId } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";
import type { PublicPageKind } from "@shared-types/page-definitions/shared/shared.public-kind.page-definition.types";
import type { AppStateStructuredDataEntry } from "@shared-types/structured-data/app-state.structured-data.types";
import type { PageMetadata } from "@shared-types/page-definitions/shared/shared.metadata.page-definition.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStatePageDefinitionDeterministicFields = Readonly<{
  id: PageId;
  kind: PublicPageKind | null;
  slug: `/${string}` | "/" | null;
  label: string;
  status: ErrorPageStatus | null;
  robots: AppStatePageRobotsDirectives | null;
  robotsTxt: AppStatePageRobotsTxtDirectives | null;
  sitemapXml: AppStatePageSitemapXmlDirectives | null;
  assets: AppStateAssets;
  breadcrumbs: readonly PageId[];
  structuredData: readonly AppStateStructuredDataEntry[];
  metadata: PageMetadata;
  content: AppStatePageContent;
}>;

export type AppStatePageDefinition = Replace<
  AuthoredPageDefinition,
  AppStatePageDefinitionDeterministicFields
>;
