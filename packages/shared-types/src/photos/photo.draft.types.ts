// packages/shared-types/src/photos/photo.draft.types.ts

export type ResolvedPhotoLocation = {
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

export type PhotoDraftEntry = {
  // --- identity ---
  slug: string;
  sourceFileName: string;

  // --- editorial ---
  title: string;
  alt: string;
  commentary: string;
  readableLocation: string;

  capturedAt: string | null;

  // --- authorship ---
  photographer: string | null;
  copyright: string | null;

  // --- equipment ---
  cameraMake: string | null;
  cameraModel: string | null;
  lensModel: string | null;

  // --- exposure triangle ---
  exposureTime: number | null;
  aperture: number | null;
  iso: number | null;

  // --- optics ---
  focalLength: number | null;
  focalLength35mm: number | null;

  // --- shooting context ---
  meteringMode: string | null;
  exposureMode: string | null;
  whiteBalance: string | null;

  // --- dimensions ---
  width: number | null;
  height: number | null;

  // --- location ---
  latitude: number | null;
  longitude: number | null;
  locationResolved: ResolvedPhotoLocation | null;
};

export type PublishedPhotoRecord = PhotoDraftEntry & {
  image: {
    id: string;
    filename: string | null;
    uploadedAt: string | null;
    variants: string[];
  };
};
