// shared-types/page-content/inline/strong/app-state.strong.inline-content.types.ts

import type { AuthoredStrongInline } from "@shared-types/page-content/inline/strong/authored.strong.inline-content.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  content: readonly AppStateInline[];
}>;

export type AppStateStrongInline = Replace<
  AuthoredStrongInline,
  DeterministicFields
>;
