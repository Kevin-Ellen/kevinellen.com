// packages/content-pipeline/src/media/types/extracted.image.metadata.types.ts

export type ExtractedImageMetadata = {
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
};
