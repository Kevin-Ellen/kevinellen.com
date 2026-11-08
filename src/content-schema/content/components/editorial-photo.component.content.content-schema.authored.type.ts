// src/content-schema/content/components/editorial-photo.component.content.content-schema.authored.type.ts

export type EditorialPhotoComponentContentAuthored = Readonly<{
  kind: "editorialPhoto";
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  description?: string;
}>;
