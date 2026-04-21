// shared-types/pages/definitions/error/app-context.base.error.definition.page.types.ts

import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";
import type { AppContextPageContent } from "@shared-types/page-content/app-context.page-content.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextErrorPageDefinitionRuntime = Readonly<{
  content: AppContextPageContent;
}>;

export type AppContextErrorPageDefinition = ReplaceAndOmit<
  AppStateErrorPageDefinition,
  AppContextErrorPageDefinitionRuntime,
  "assets" | "breadcrumbs"
>;
