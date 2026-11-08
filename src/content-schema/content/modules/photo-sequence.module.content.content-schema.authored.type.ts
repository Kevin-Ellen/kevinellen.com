// src/content-schema/content/modules/photo-sequence.module.content.content-schema.authored.type.ts

import type { PhotoComponentContentAuthored } from "../components/photo.component.content.content-schema.authored.type";

export type PhotoSequenceModuleContentAuthored = Readonly<{
  kind: "photoSequence";
  photos: readonly PhotoComponentContentAuthored[];
  caption?: string;
}>;
