// src/content-schema/content/modules/final-words.module.content.content-schema.authored.type.ts

import type { ComponentContentAuthored } from "../components/component.content.content-schema.authored.type";

export type FinalWordsModuleContentAuthored = Readonly<{
  kind: "finalWords";
  eyebrow: string;
  heading: Readonly<{
    id: string;
    text: string;
    level: 2;
  }>;
  components: readonly ComponentContentAuthored[];
}>;
