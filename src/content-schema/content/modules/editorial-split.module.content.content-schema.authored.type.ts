// src/content-schema/content/modules/editorial-split.module.content.content-schema.authored.type.ts

import type { ComponentContentAuthored } from "../components/component.content.content-schema.authored.type";

import type { EditorialPhotoComponentContentAuthored } from "../components/editorial-photo.component.content.content-schema.authored.type";
import type { RichListComponentContentAuthored } from "../components/rich-list.component.content.content-schema.authored.type";

export type EditorialSplitModuleContentAuthored = Readonly<{
  kind: "editorialSplit";
  id: string;
  reverse?: boolean;
  eyebrow: string;
  heading: Readonly<{
    id: string;
    text: string;
    level: 2;
  }>;
  components: readonly ComponentContentAuthored[];
  media:
    | EditorialPhotoComponentContentAuthored
    | RichListComponentContentAuthored;
}>;
