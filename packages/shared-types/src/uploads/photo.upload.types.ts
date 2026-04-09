// packages/shared-types/uploads/photo.upload.types.ts

type PhotoResolvedLocation = {
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
  displayName: string;
};

export type PhotoDraftEntry = {
  slug: string;
  sourceFileName: string;

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

  width: number | null;
  height: number | null;

  latitude: number | null;
  longitude: number | null;

  locationResolved: PhotoResolvedLocation | null;
};
