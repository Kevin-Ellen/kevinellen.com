// src/content-schema/content/modules/editorial-feature.module.content.content-schema.authored.type.ts

import type { ComponentContentAuthored } from "../components/component.content.content-schema.authored.type";
import type { EditorialPhotoComponentContentAuthored } from "../components/editorial-photo.component.content.content-schema.authored.type";

export type EditorialFeatureModuleContentAuthored = Readonly<{
  kind: "editorialFeature";
  id: string;
  eyebrow: string;
  heading: Readonly<{
    id: string;
    text: string;
    level: 2;
  }>;
  components: readonly ComponentContentAuthored[];
  media: EditorialPhotoComponentContentAuthored;
}>;
