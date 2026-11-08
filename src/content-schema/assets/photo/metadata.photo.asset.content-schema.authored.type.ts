// src/content-schema/assets/photo/metadata.photo.asset.content-schema.authored.type.ts

export type PhotoAssetMetadataAuthored = Readonly<{
  id: string;
  title: string;

  photographer: string;
  copyright: string;

  capturedAt: string;

  cameraModel: string;
  lensModel: string | null;

  exposureTime: number;
  aperture: number;
  iso: number;
  focalLength: number;

  width: number;
  height: number;

  location: string | null;
}>;
