// shared-types/pages/definitions/error/app-render-context.base.error.definition.page.types.ts

import type { AppContextErrorPageDefinition } from "@shared-types/pages/definitions/error/app-context.base.error.definition.page.types";
import type { AppRenderContextPageContent } from "@shared-types/page-content/app-render-context.page-content.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextErrorPageDefinitionRuntime = Readonly<{
  content: AppRenderContextPageContent;
}>;

export type AppRenderContextErrorPageDefinition = Replace<
  AppContextErrorPageDefinition,
  AppRenderContextErrorPageDefinitionRuntime
>;
