// shared-types/page-content/inline/external-link/app-state.external-link.inline-content.types.ts

import type { AuthoredExternalLinkInline } from "@shared-types/page-content/inline/external-link/authored.external-link.inline-content.types";
import type { AppStateExternalLink } from "@shared-types/links/app-state.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  link: AppStateExternalLink;
}>;

export type AppStateExternalLinkInline = Replace<
  AuthoredExternalLinkInline,
  DeterministicFields
>;
