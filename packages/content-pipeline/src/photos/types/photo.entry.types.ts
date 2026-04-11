// packages/content-pipeline/src/photos/types/photo.entry.types.ts

import type { ResolvedImageLocation } from "@content-pipeline/media/types/resolved.image.metadata.types";

export type PhotoEntry = {
  id: string;
  slug: string;

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

  meteringMode: string | null;
  exposureMode: string | null;
  whiteBalance: string | null;

  width: number;
  height: number;

  latitude: number | null;
  longitude: number | null;

  locationResolved: ResolvedImageLocation | null;
};
