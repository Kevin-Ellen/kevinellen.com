// shared-types/page-definitions/app-context.page-definition.types.ts

import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextPageContent } from "@shared-types/page-content/app-context.page-content.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextPageDefinitionRuntimeFields = Readonly<{
  content: AppContextPageContent;
}>;

export type AppContextPageDefinition = ReplaceAndOmit<
  AppStatePageDefinition,
  AppContextPageDefinitionRuntimeFields,
  | "structuredData"
  | "robotsTxt"
  | "sitemapXml"
  | "assets"
  | "breadcrumbs"
  | "metadata"
  | "robots"
>;
