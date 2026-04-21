// shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.page-content.types.ts

import type { AppStateInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.page-content.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextInternalLinkInlineContentRuntimeFields = Readonly<{
  link: AppContextInternalLink;
}>;

export type AppContextInternalLinkInlineContent = Replace<
  AppStateInternalLinkInlineContent,
  AppContextInternalLinkInlineContentRuntimeFields
>;
