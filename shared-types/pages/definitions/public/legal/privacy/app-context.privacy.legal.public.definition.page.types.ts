// shared-types/pages/definitions/public/legal/privacy/app-context.privacy.legal.public.definition.page.types.ts

import type { AppStatePrivacyLegalPublicPage } from "@shared-types/pages/definitions/public/legal/privacy/app-state.privacy.legal.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextPrivacyLegalPublicPage = ReplaceAndOmit<
  AppStatePrivacyLegalPublicPage,
  AppContextPublicBasePageDefinition,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
