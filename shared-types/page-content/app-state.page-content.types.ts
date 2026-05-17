// shared-types/page-content/app-state.page-content.types.ts

import type { AuthoredPageContent } from "@shared-types/page-content/authored.page-content.types";
import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.types";
import type { AppStateBlock } from "@shared-types/page-content/block/app-state.block.types";
import type { AppStatePageContentFooter } from "@shared-types/page-content/footer/app-state.page-footer.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  head: AppStatePageContentHead;
  content: readonly AppStateBlock[];
  footer: readonly AppStatePageContentFooter[];
}>;

export type AppStatePageContent = Replace<
  AuthoredPageContent,
  DeterministicFields
>;
