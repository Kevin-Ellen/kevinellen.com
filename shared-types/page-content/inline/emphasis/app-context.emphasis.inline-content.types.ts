// shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.types.ts

import type { AppStateEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.types";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  content: readonly AppContextInline[];
}>;

export type AppContextEmphasisInline = Replace<
  AppStateEmphasisInline,
  RuntimeFields
>;
