// src/content-schema/content/modules/metadata-bar.module.content.content-schema.authored.type.ts

export type MetadataBarModuleContentAuthored = Readonly<{
  kind: "metadataBar";
  heading?: string;

  cameras: readonly string[];
  lenses: readonly string[];
  location: string | null;
}>;
