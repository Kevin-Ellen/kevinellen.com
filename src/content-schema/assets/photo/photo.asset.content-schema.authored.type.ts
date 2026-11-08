// src/content-schema/assets/photo/photo.asset.content-schema.authored.type.ts

export type PhotoResolvedLocationAuthored = Readonly<{
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
}>;

export type PhotoSpeciesAuthored = Readonly<{
  name: string;
  scientificName: string;
}>;

type PhotoCapturedAtAuthored = Readonly<{
  utc: string;
  timezone: string | null;
}>;

export type PhotoAssetAuthored = Readonly<{
  id: string;
  sourceFileName: string;

  cloudflareImageId: string | null;
  cloudflareUploadedAt: string | null;

  title: string;
  alt: string;
  commentary: string;
  readableLocation: string | null;

  species?: readonly PhotoSpeciesAuthored[];

  capturedAt: PhotoCapturedAtAuthored;

  photographer: string;
  copyright: string;

  cameraMake: string;
  cameraModel: string;
  lensModel: string | null;

  exposureTime: number;
  aperture: number;
  iso: number;

  focalLength: number;
  focalLength35mm: number | null;

  width: number;
  height: number;

  latitude: number | null;
  longitude: number | null;

  resolvedLocation: PhotoResolvedLocationAuthored | null;
}>;
