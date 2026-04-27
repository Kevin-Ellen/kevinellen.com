// packages/content-pipeline/src/photos/types/photo.kv.record.types.ts

import type { ResolvedImageLocation } from "@content-pipeline/media/types/resolved.image.metadata.types";

export type PhotoKvRecord = {
  id: string;

  title: string;
  alt: string;
  commentary: string;

  readableLocation: string | null;
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

  locationResolved: ResolvedImageLocation | null;

  image: {
    id: string;
    uploadedAt: string;
  };
};
