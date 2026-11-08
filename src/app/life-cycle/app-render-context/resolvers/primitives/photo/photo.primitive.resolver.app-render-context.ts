// src/app/life-cycle/app-render-context/resolvers/primitives/photo/photo.primitive.resolver.app-render-context.ts

import type { PhotoAppResolve } from "../../../../../types/photo/photo.app-resolve.type";
import type { PhotoAppRenderContext } from "../../../../../types/photo/photo.app-render-context.type";

type Input = Readonly<{
  photo: PhotoAppResolve;
  alt?: string;
  commentary?: string | null;
}>;

const responsiveWidths = [400, 640, 800, 1024, 1200, 1600, 1920] as const;

const getResponsiveWidths = (maxWidth: number): number[] => [
  ...responsiveWidths.filter((width) => width < maxWidth),
  maxWidth,
];

const getImageUrl = (
  photoId: string,
  width: number,
  originalWidth: number,
  originalHeight: number,
): string => {
  const height = Math.round((originalHeight / originalWidth) * width);

  return `/media/photo/${width}/${height}/${encodeURIComponent(photoId)}`;
};

const formatShutter = (seconds: number): string => {
  if (seconds <= 0) return "—";

  return seconds < 1 ? `1/${Math.round(1 / seconds)}s` : `${seconds}s`;
};

export const resolvePhotoAppRenderContext = ({
  photo,
  alt,
  commentary,
}: Input): PhotoAppRenderContext => {
  const widths = getResponsiveWidths(photo.dimensions.width);

  const src = getImageUrl(
    photo.id,
    photo.dimensions.width,
    photo.width,
    photo.height,
  );

  const srcSet = widths
    .map(
      (width) =>
        `${getImageUrl(photo.id, width, photo.width, photo.height)} ${width}w`,
    )
    .join(", ");

  return {
    id: photo.id,
    title: photo.title,
    alt: alt ?? photo.alt,
    commentary: commentary === undefined ? photo.commentary : commentary,
    location: photo.readableLocation,

    width: photo.width,
    height: photo.height,

    image: {
      id: photo.cloudflareImageId ?? photo.id,
      src,
      srcSet,
    },

    metadata: {
      shutter: formatShutter(photo.exposureTime),
      aperture: `f/${photo.aperture}`,
      focalLength: `${photo.focalLength}mm`,
      iso: String(photo.iso),
    },
  };
};
