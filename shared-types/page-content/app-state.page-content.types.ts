// shared-types/page-content/app-state.page-content.types.ts

import type { AuthoredPageContent } from "@shared-types/page-content/authored.page-content.types";
import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.page-content.types";
import type { AppStateBlockContentModule } from "@shared-types/page-content/block/app-state.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStatePageContentDeterministicFields = Readonly<{
  header: AppStatePageContentHead;
  content: readonly AppStateBlockContentModule[];
  footer: readonly AppStateBlockContentModule[];
}>;

export type AppStatePageContent = Replace<
  AuthoredPageContent,
  AppStatePageContentDeterministicFields
>;
