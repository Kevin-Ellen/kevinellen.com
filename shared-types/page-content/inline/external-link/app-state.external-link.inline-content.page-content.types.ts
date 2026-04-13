// shared-types/page-content/inline/external-link/app-state.external-link.inline-content.page-content.types.ts

import type { AuthoredExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/authored.external-link.inline-content.page-content.types";
import type { AppStateExternalLink } from "@shared-types/links/app-state.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateExternalLinkInlineContentDeterministicFields = Readonly<{
  link: AppStateExternalLink;
}>;

export type AppStateExternalLinkInlineContent = Replace<
  AuthoredExternalLinkInlineContent,
  AppStateExternalLinkInlineContentDeterministicFields
>;
