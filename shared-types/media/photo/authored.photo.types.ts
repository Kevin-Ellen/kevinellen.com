// shared-types/media/photo/authored.photo.types.ts

import type { AuthoredResolvedLocation } from "@shared-types/media/photo/location.photo.types";

export type AuthoredPhotoMetadata = Readonly<{
  id: string;
  sourceFileName: string;

  cloudflareImageId: string | null;
  cloudflareUploadedAt: string | null;

  title: string;
  alt: string;
  commentary: string;
  readableLocation: string;

  capturedAt: string | null;

  photographer: string | null;
  copyright: string | null;

  cameraMake: string | null;
  cameraModel: string | null;
  lensModel: string | null;

  exposureTime: number | null;
  aperture: number | null;
  iso: number | null;

  focalLength: number | null;
  focalLength35mm: number | null;

  width: number;
  height: number;

  latitude: number | null;
  longitude: number | null;

  resolvedLocation: AuthoredResolvedLocation | null;
}>;
