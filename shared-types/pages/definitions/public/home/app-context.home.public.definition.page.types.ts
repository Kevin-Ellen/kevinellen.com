// shared-types/pages/definitions/public/home/app-context.home.public.definition.page.types.ts

import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { AppStateHomePublicPage } from "@shared-types/pages/definitions/public/home/app-state.home.public.definition.page.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextHomePublicPage = ReplaceAndOmit<
  AppStateHomePublicPage,
  AppContextPublicBasePageDefinition,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
