// src/content-schema/content/components/component.content.content-schema.authored.type.ts

import type { ParagraphComponentContentAuthored } from "./paragraph.component.content.content-schema.authored.type";
import type { ListComponentContentAuthored } from "./list.component.content.content-schema.authored.type";
import type { PhotoComponentContentAuthored } from "./photo.component.content.content-schema.authored.type";
import type { EditorialPhotoComponentContentAuthored } from "./editorial-photo.component.content.content-schema.authored.type";
import type { RichListComponentContentAuthored } from "./rich-list.component.content.content-schema.authored.type";

export type ComponentContentAuthored =
  | ParagraphComponentContentAuthored
  | ListComponentContentAuthored
  | PhotoComponentContentAuthored
  | EditorialPhotoComponentContentAuthored
  | RichListComponentContentAuthored;
