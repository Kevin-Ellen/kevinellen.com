// src/content-schema/content/modules/banner.module.content.content-schema.authored.type.ts

import type { ComponentContentAuthored } from "../components/component.content.content-schema.authored.type";
import type { EditorialPhotoComponentContentAuthored } from "../components/editorial-photo.component.content.content-schema.authored.type";

export type BannerModuleContentAuthored = Readonly<{
  kind: "banner";
  heading: Readonly<{
    id: string;
    text: string;
    level: 2;
  }>;
  media: EditorialPhotoComponentContentAuthored;
  components: readonly ComponentContentAuthored[];
}>;
