// src/content-schema/content/modules/photo-pair.module.content.content-schema.authored.type.ts

import type { PhotoComponentContentAuthored } from "../components/photo.component.content.content-schema.authored.type";

export type PhotoPairModuleContentAuthored = Readonly<{
  kind: "photoPair";
  photos: readonly [
    PhotoComponentContentAuthored,
    PhotoComponentContentAuthored,
  ];
}>;
