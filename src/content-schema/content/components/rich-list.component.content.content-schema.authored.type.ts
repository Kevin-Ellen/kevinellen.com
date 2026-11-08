// src/content-schema/content/components/rich-list.component.content.content-schema.authored.type.ts

import type { SvgReferenceAuthored } from "../../assets/svg.asset.content-schema.authored.type";

export type RichListComponentContentAuthored = Readonly<{
  kind: "richList";
  items: readonly Readonly<{
    icon: SvgReferenceAuthored;
    label: string;
    values: readonly string[];
  }>[];
}>;
