// shared-types/pages/definitions/public/legal/terms/app-context.terms.legal.public.definition.page.types.ts

import type { AppStateTermsLegalPublicPage } from "@shared-types/pages/definitions/public/legal/terms/app-state.terms.legal.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextTermsLegalPublicPage = ReplaceAndOmit<
  AppStateTermsLegalPublicPage,
  AppContextPublicBasePageDefinition,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
