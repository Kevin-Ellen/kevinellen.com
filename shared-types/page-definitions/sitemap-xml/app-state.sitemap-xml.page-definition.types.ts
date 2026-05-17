// shared-types/page-definitions/sitemap-xml/app-state.sitemap-xml.page-definition.types.ts

import type { AuthoredPageSitemapXmlDirectives } from "@shared-types/page-definitions/sitemap-xml/authored.sitemap-xml.page-definition.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStatePageSitemapXmlDirectivesDeterministicFields = Readonly<{
  include: boolean;
}>;

export type AppStatePageSitemapXmlDirectives = Replace<
  AuthoredPageSitemapXmlDirectives,
  AppStatePageSitemapXmlDirectivesDeterministicFields
>;
