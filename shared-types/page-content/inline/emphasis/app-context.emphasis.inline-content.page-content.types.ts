// shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.page-content.types.ts

import type { AppStateEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.page-content.types";
import type { AppContextInlineContent } from "@shared-types/page-content/inline/app-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextEmphasisInlineContentRuntimeFields = Readonly<{
  content: readonly AppContextInlineContent[];
}>;

export type AppContextEmphasisInlineContent = Replace<
  AppStateEmphasisInlineContent,
  AppContextEmphasisInlineContentRuntimeFields
>;
