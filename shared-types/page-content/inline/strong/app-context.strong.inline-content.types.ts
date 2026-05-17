// shared-types/page-content/inline/strong/app-context.strong.inline-content.types.ts

import type { AppStateStrongInline } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.types";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  content: readonly AppContextInline[];
}>;

export type AppContextStrongInline = Replace<
  AppStateStrongInline,
  RuntimeFields
>;
