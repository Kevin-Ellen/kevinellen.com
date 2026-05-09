// shared-types/page-content/inline/external-link/app-context.external-link.inline-content.types.ts

import type { AppStateExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.types";
import type { AppContextExternalLink } from "@shared-types/links/app-context.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  link: AppContextExternalLink;
}>;

export type AppContextExternalLinkInline = Replace<
  AppStateExternalLinkInline,
  RuntimeFields
>;
