// shared-types/pages/definitions/public/about/equipment/app-context.equipment.about.public.definition.page.types.ts

import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { AppStateEquipmentAboutPublicPage } from "@shared-types/pages/definitions/public/about/equipment/app-state.equipment.about.public.definition.page.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextEquipmentAboutPublicPage = ReplaceAndOmit<
  AppStateEquipmentAboutPublicPage,
  AppContextPublicBasePageDefinition,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
