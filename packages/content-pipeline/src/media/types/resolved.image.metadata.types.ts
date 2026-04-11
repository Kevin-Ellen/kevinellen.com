// packages/content-pipeline/src/media/types/resolved.image.metadata.types.ts

export type ResolvedImageLocation = {
  name: string | null;
  road: string | null;
  village: string | null;
  town: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  postcode: string | null;
  displayName: string | null;
};

export type ResolvedImageMetadata = {
  sourceFileName: string;

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
