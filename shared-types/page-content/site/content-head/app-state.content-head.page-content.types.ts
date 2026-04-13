// shared-types/page-content/site/content-head/app-state.content-head.page-content.types.ts

import type { AuthoredPageContentHead } from "@shared-types/page-content/site/content-head/authored.content-head.page-content.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStatePageContentHeadDeterministicFields = Readonly<{
  eyebrow: string | null;
  intro: string | null;
}>;

export type AppStatePageContentHead = Replace<
  AuthoredPageContentHead,
  AppStatePageContentHeadDeterministicFields
>;
