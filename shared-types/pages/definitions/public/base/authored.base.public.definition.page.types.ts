// shared-types/pages/definitions/public/base/authored.base.public.definition.page.types.ts

import type { AuthoredBasePageDefinition } from "@shared-types/pages/definitions/authored.base.definition.page.types";
import type { PublicPageKind } from "@shared-types/pages/public/kind.public.page.types";
import type { AuthoredAssets } from "@shared-types/pages/shared/assets/authored.assets.shared.page.types";
import type { AuthoredPageRobotsDirectives } from "@shared-types/pages/shared/authored.robots.shared.page.types";
import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";
import type { AuthoredStructuredDataEntry } from "@shared-types/structured-data/authored.structured-data.types";
import type { AuthoredRobotsTxt } from "@shared-types/pages/public/robots-txt/authored.robots-txt.public.page.types";
import type { AuthoredSitemapXml } from "@shared-types/pages/public/sitemap-xml/authored.sitemap-xml.public.page.types";

type AuthoredBasePublicPageDefinitionSpecialisedFields = Readonly<{
  id: PageIdPublic;
  kind: PublicPageKind;
  slug: `/${string}` | "/";
  label: string;
  robots?: AuthoredPageRobotsDirectives;
  robotsTxt?: AuthoredRobotsTxt;
  sitemapXml?: AuthoredSitemapXml;
  assets?: AuthoredAssets;
  sitemap?: AuthoredSitemapXml;
  breadcrumbs?: readonly PageIdPublic[];
  structuredData?: readonly AuthoredStructuredDataEntry[];
}>;

export type AuthoredBasePublicPageDefinition = Readonly<
  AuthoredBasePageDefinition & AuthoredBasePublicPageDefinitionSpecialisedFields
>;
