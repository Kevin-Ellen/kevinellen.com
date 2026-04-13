// shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.page-content.types.ts

import type { AuthoredInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/authored.internal-link.inline-content.page-content.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateInternalLinkInlineContentDeterministicFields = Readonly<{
  link: AppStateInternalLink;
}>;

export type AppStateInternalLinkInlineContent = Replace<
  AuthoredInternalLinkInlineContent,
  AppStateInternalLinkInlineContentDeterministicFields
>;
