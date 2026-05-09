// shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.types.ts

import type { AppStateInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  link: AppContextInternalLink;
}>;

export type AppContextInternalLinkInline = Replace<
  AppStateInternalLinkInline,
  RuntimeFields
>;
