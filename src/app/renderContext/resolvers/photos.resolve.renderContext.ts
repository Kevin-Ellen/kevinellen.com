// src/app/renderContext/resolvers/photos.resolve.renderContext.ts

import type { AppContextPhoto } from "@app/appContext/appContext.types";
import type {
  RenderContextPhoto,
  RenderContextPhotoVariant,
  RenderContextPhotoVariantSource,
} from "@app/renderContext/renderContext.types";

const PHOTO_VARIANT_ORDER: readonly RenderContextPhotoVariant[] = [
  "frame",
  "content",
];

const PHOTO_WIDTH_ORDER = [480, 768, 1024, 1400] as const;

type PhotoVariantWidth = (typeof PHOTO_WIDTH_ORDER)[number];

const buildVariantSourceUrl = (
  baseUrl: string,
  width: PhotoVariantWidth,
): string => {
  return `${baseUrl}${String(width)}w`;
};

const resolveVariantSources = (
  baseUrl: string,
): readonly RenderContextPhotoVariantSource[] => {
  return PHOTO_WIDTH_ORDER.map((width) => ({
    width,
    url: buildVariantSourceUrl(baseUrl, width),
  }));
};

const validateVariant = (
  photo: AppContextPhoto,
  variant: RenderContextPhotoVariant,
): void => {
  if (!photo.image.urls[variant]) {
    throw new Error(
      `Photo "${photo.id}" declares variant "${variant}" but has no URL.`,
    );
  }
};

const validatePhotoIntrinsic = (photo: AppContextPhoto): void => {
  if (
    photo.intrinsic.width === null ||
    photo.intrinsic.height === null ||
    photo.intrinsic.width <= 0 ||
    photo.intrinsic.height <= 0
  ) {
    throw new Error(`Photo "${photo.id}" has invalid intrinsic dimensions.`);
  }
};

const resolvePhotoSources = (
  photo: AppContextPhoto,
): RenderContextPhoto["image"]["sources"] => {
  const resolvedSources: Partial<RenderContextPhoto["image"]["sources"]> = {};

  for (const variant of PHOTO_VARIANT_ORDER) {
    validateVariant(photo, variant);

    resolvedSources[variant] = resolveVariantSources(photo.image.urls[variant]);
  }

  return resolvedSources;
};

const resolvePhotoRenderContext = (
  photo: AppContextPhoto,
): RenderContextPhoto => {
  validatePhotoIntrinsic(photo);

  return {
    id: photo.id,
    title: photo.title,
    alt: photo.alt,
    commentary: photo.commentary,
    readableLocation: photo.readableLocation,
    capturedAt: photo.capturedAt,
    cameraModel: photo.cameraModel,
    lensModel: photo.lensModel,
    exposureTime: photo.exposureTime,
    aperture: photo.aperture,
    iso: photo.iso,
    focalLength: photo.focalLength,
    intrinsic: {
      width: photo.intrinsic.width,
      height: photo.intrinsic.height,
    },
    image: {
      id: photo.image.id,
      uploadedAt: photo.image.uploadedAt,
      sources: resolvePhotoSources(photo),
    },
  };
};

export const resolvePhotosRenderContext = (
  photos: readonly AppContextPhoto[],
): readonly RenderContextPhoto[] => {
  return photos.map(resolvePhotoRenderContext);
};
