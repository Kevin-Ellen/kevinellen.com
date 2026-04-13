// shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.page-content.types.ts

import type { AuthoredEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.page-content.types";
import type { AppStateInlineContent } from "@shared-types/page-content/inline/app-state.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateEmphasisInlineContentDeterministicFields = Readonly<{
  content: readonly AppStateInlineContent[];
}>;

export type AppStateEmphasisInlineContent = Replace<
  AuthoredEmphasisInlineContent,
  AppStateEmphasisInlineContentDeterministicFields
>;
