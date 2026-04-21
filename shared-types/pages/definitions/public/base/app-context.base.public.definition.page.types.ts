// shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types.ts

import type { AppStatePublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { AppContextPageContent } from "@shared-types/page-content/app-context.page-content.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextPublicBasePageDefinitionRuntime = Readonly<{
  content: AppContextPageContent;
}>;

export type AppContextPublicBasePageDefinition = ReplaceAndOmit<
  AppStatePublicBasePageDefinition,
  AppContextPublicBasePageDefinitionRuntime,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
