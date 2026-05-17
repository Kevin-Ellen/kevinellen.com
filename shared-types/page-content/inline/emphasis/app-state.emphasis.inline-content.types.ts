// shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.types.ts

import type { AuthoredEmphasisInline } from "@shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  content: readonly AppStateInline[];
}>;

export type AppStateEmphasisInline = Replace<
  AuthoredEmphasisInline,
  DeterministicFields
>;
