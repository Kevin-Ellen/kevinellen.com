// src/content-schema/content/modules/page-intro.module.content.content-schema.authored.type.ts

export type PageIntroModuleContentAuthored = Readonly<{
  kind: "pageIntro";
  eyebrow?: string;
  title: string;
  description?: string;
  location?: string;
}>;
