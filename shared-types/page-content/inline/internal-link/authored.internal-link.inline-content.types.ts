// shared-types/page-content/inline/internal-link/authored.internal-link.inline-content.types.ts

import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";

export type AuthoredInternalLinkInline = Readonly<{
  kind: "internalLink";
  link: AuthoredInternalLink;
}>;
