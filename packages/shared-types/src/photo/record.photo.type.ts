// packages/shared-types/src/photo/record.photo.type.ts

export type PhotoVariant = "frame" | "content";

export type PhotoRecord = PhotoKvRecord & {
  id: string;
};

export type PhotoKvRecord = {
  title: string;
  alt: string;
  commentary: string;
  readableLocation?: string;
  capturedAt?: string;
  cameraModel?: string;
  lensModel?: string;
  exposureTime?: number;
  aperture?: number;
  iso?: number;
  focalLength?: number;
  width: number;
  height: number;
  image: {
    id: string;
    filename: string;
    uploadedAt: string;
    variants: readonly PhotoVariant[];
  };
};
