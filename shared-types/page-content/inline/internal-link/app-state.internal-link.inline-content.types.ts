// shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.types.ts

import type { AuthoredInternalLinkInline } from "@shared-types/page-content/inline/internal-link/authored.internal-link.inline-content.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  link: AppStateInternalLink;
}>;

export type AppStateInternalLinkInline = Replace<
  AuthoredInternalLinkInline,
  DeterministicFields
>;
