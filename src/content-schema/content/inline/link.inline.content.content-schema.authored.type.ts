// src/content-schema/content/inline/link.inline.content.content-schema.authored.type.ts

import type { LinkAuthored } from "../../primitives/link.primitive.content-schema.authored.type";

export type LinkInlineContentAuthored = Readonly<{
  kind: "link";
  link: LinkAuthored;
}>;
