// packages/shared-types/src/photo/record.photo.type.ts

export type PhotoVariant = "frame" | "content";

export type PhotoRecord = PhotoKvRecord & {
  id: string;
};

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

  image: {
    id: string;
    uploadedAt: string;
  };
};
