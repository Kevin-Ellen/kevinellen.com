// shared-types/pages/definitions/public/about/app-context.about.public.definition.page.types.ts

import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { AppStateAboutPublicPage } from "@shared-types/pages/definitions/public/about/app-state.about.public.definition.page.types";

import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextAboutPublicPage = ReplaceAndOmit<
  AppStateAboutPublicPage,
  AppContextPublicBasePageDefinition,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
