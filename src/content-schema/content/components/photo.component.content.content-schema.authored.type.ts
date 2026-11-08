// src/content-schema/content/components/photo.component.content.content-schema.authored.type.ts

export type PhotoComponentContentAuthored = Readonly<{
  kind: "photo";
  photoId: string;
  alt?: string;
  commentary?: string;
  wide?: boolean;
}>;
