// shared-types/pages/definitions/public/legal/licensing/app-context.licensing.legal.public.definition.page.types.ts

import type { AppStateLicensingLegalPublicPage } from "@shared-types/pages/definitions/public/legal/licensing/app-state.licensing.legal.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextLicensingLegalPublicPage = ReplaceAndOmit<
  AppStateLicensingLegalPublicPage,
  AppContextPublicBasePageDefinition,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
