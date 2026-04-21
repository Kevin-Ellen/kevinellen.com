// shared-types/page-content/inline/strong/app-context.strong.inline-content.page-content.types.ts

import type { AppStateStrongInlineContent } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.page-content.types";
import type { AppContextInlineContent } from "@shared-types/page-content/inline/app-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextStrongInlineContentRuntimeFields = Readonly<{
  content: readonly AppContextInlineContent[];
}>;

export type AppContextStrongInlineContent = Replace<
  AppStateStrongInlineContent,
  AppContextStrongInlineContentRuntimeFields
>;
