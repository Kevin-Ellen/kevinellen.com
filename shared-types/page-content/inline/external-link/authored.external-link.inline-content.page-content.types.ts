// shared-types/page-content/inline/external-link/authored.external-link.inline-content.page-content.types.ts

import type { AuthoredExternalLink } from "@shared-types/links/authored.links.types";

export type AuthoredExternalLinkInlineContent = Readonly<{
  kind: "externalLink";
  link: AuthoredExternalLink;
}>;
