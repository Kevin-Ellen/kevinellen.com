// shared-types/pages/definitions/public/about/technology/app-context.technology.about.public.definition.page.types.ts

import type { AppStateTechnologyAboutPublicPage } from "@shared-types/pages/definitions/public/about/technology/app-state.technology.about.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextTechnologyAboutPublicPage = ReplaceAndOmit<
  AppStateTechnologyAboutPublicPage,
  AppContextPublicBasePageDefinition,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
