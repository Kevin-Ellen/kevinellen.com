// shared-types/page-content/inline/code/app-state.code.inline-content.types.ts

import type { AuthoredCodeInline } from "@shared-types/page-content/inline/code/authored.code.inline-content.types";
import type { CodeLanguage } from "@shared-types/page-content/shared/code/authored.code.shared.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  language: CodeLanguage | null;
}>;

export type AppStateCodeInline = Replace<
  AuthoredCodeInline,
  DeterministicFields
>;
