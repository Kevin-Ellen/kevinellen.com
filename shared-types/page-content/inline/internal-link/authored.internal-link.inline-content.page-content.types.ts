// shared-types/page-content/inline/internal-link/authored.internal-link.inline-content.page-content.types.ts

import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";

export type AuthoredInternalLinkInlineContent = Readonly<{
  kind: "internalLink";
  link: AuthoredInternalLink;
}>;
