// src/content-schema/content/components/list.component.content.content-schema.authored.type.ts

import type { InlineContentAuthored } from "../inline/inline.content.content-schema.authored.type";

export type ListComponentContentAuthored = Readonly<{
  kind: "list";
  items: readonly Readonly<{
    content: readonly InlineContentAuthored[];
  }>[];
}>;
