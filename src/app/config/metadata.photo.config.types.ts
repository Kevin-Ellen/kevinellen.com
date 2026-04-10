// src/app/config/metadata.photo.config.types.ts

export type PhotoMetadataKey =
  | "location"
  | "shutterSpeed"
  | "aperture"
  | "focalLength"
  | "iso";

export type PhotoMetadataDefinition = {
  label: string;
  description?: string;
};

export type PhotoMetadataConfig = Record<
  PhotoMetadataKey,
  PhotoMetadataDefinition
>;
