// shared-types/page-definitions/authored.public.page-definition.types.ts

import type { AuthoredBasePageDefinition } from "@shared-types/page-definitions/authored.base.page-definition.types";
import type { AuthoredAssets } from "@shared-types/page-definitions/assets/authored.assets.page-definition.types";
import type { AuthoredPageRobotsDirectives } from "@shared-types/page-definitions/robots/authored.robots.page-definition.types";
import type { AuthoredPageRobotsTxtDirectives } from "@shared-types/page-definitions/robots-txt/authored.robots-txt.page-definition.types";
import type { AuthoredPageSitemapXmlDirectives } from "@shared-types/page-definitions/sitemap-xml/authored.sitemap-xml.page-definition.types";
import type { PublicPageKind } from "@shared-types/page-definitions/shared/shared.public-kind.page-definition.types";
import type { PageIdPublic } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";
import type { AuthoredStructuredDataEntry } from "@shared-types/structured-data/authored.structured-data.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AuthoredPublicPageDefinitionSpecialisedFields = Readonly<{
  id: PageIdPublic;
  kind: PublicPageKind;
  slug: `/${string}` | "/";
  robots?: AuthoredPageRobotsDirectives;
  robotsTxt?: AuthoredPageRobotsTxtDirectives;
  sitemapXml?: AuthoredPageSitemapXmlDirectives;
  assets?: AuthoredAssets;
  breadcrumbs?: readonly PageIdPublic[];
  structuredData?: readonly AuthoredStructuredDataEntry[];
}>;

export type AuthoredPublicPageDefinition = Replace<
  AuthoredBasePageDefinition,
  AuthoredPublicPageDefinitionSpecialisedFields
>;
