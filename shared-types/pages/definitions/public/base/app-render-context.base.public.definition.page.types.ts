// shared-types/pages/definitions/public/base/app-render-context.base.public.definition.page.types.ts

import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { AppRenderContextPageContent } from "@shared-types/page-content/app-render-context.page-content.types";

import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextPublicBasePageDefinitionRuntime = Readonly<{
  content: AppRenderContextPageContent;
}>;

export type AppRenderContextPublicBasePageDefinition = ReplaceAndOmit<
  AppContextPublicBasePageDefinition,
  AppRenderContextPublicBasePageDefinitionRuntime,
  "id" | "kind" | "slug" | "label"
>;
