// src/content-schema/content/modules/editorial-intro.module.content.content-schema.authored.type.ts

import type { EditorialPhotoComponentContentAuthored } from "../components/editorial-photo.component.content.content-schema.authored.type";

export type EditorialIntroModuleContentAuthored = Readonly<{
  kind: "editorialIntro";
  eyebrow: string;
  title: string;
  statement: string;
  description: string;
  location?: string;
  portrait?: EditorialPhotoComponentContentAuthored;
}>;
