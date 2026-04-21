// shared-types/page-content/inline/external-link/app-context.external-link.inline-content.page-content.types.ts

import type { AppStateExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.page-content.types";
import type { AppContextExternalLink } from "@shared-types/links/app-context.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextExternalLinkInlineContentRuntimeFields = Readonly<{
  link: AppContextExternalLink;
}>;

export type AppContextExternalLinkInlineContent = Replace<
  AppStateExternalLinkInlineContent,
  AppContextExternalLinkInlineContentRuntimeFields
>;
