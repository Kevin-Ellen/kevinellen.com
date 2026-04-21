// shared-types/page-content/app-context.page-content.types.ts

import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";
import type { AppContextPageContentHead } from "@shared-types/page-content/site/content-head/app-context.content-head.page-content.types";
import type { AppContextBlockContentModule } from "@shared-types/page-content/block/app-context.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextPageContentRuntimeFields = Readonly<{
  head: AppContextPageContentHead;
  body: readonly AppContextBlockContentModule[];
  footer: readonly AppContextBlockContentModule[];
}>;

export type AppContextPageContent = Replace<
  AppStatePageContent,
  AppContextPageContentRuntimeFields
>;
