// shared-types/page-content/inline/strong/app-state.strong.inline-content.page-content.types.ts

import type { AuthoredStrongInlineContent } from "@shared-types/page-content/inline/strong/authored.strong.inline-content.page-content.types";
import type { AppStateInlineContent } from "@shared-types/page-content/inline/app-state.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateStrongInlineContentDeterministicFields = Readonly<{
  content: readonly AppStateInlineContent[];
}>;

export type AppStateStrongInlineContent = Replace<
  AuthoredStrongInlineContent,
  AppStateStrongInlineContentDeterministicFields
>;
