// shared-types/page-content/app-context.page-content.types.ts

import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";
import type { AppContextPageContentHead } from "@shared-types/page-content/site/content-head/app-context.content-head.types";
import type { AppContextBlock } from "@shared-types/page-content/block/app-context.block.types";
import type { AppContextPageContentFooter } from "@shared-types/page-content/footer/app-context.page-footer.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  head: AppContextPageContentHead;
  content: readonly AppContextBlock[];
  footer: readonly AppContextPageContentFooter[];
}>;

export type AppContextPageContent = Replace<AppStatePageContent, RuntimeFields>;
