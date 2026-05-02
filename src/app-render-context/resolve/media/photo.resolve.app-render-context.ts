// src/app-render-context/resolve/media/photo.resolve.app-render-context.ts

import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type {
  AppRenderContextPhoto,
  AppRenderContextPhotoMetaGroup,
  AppRenderContextPhotoMetaItem,
} from "@shared-types/media/photo/app-render-context.photo.types";
import type { AppStateMetadataLabels } from "@shared-types/config/metadata-labels/app-state.metadata-labels.types";

import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";
import { formatDate } from "@utils/date.format.util";

const PHOTO_SRCSET_WIDTHS = [640, 960, 1440, 1920] as const;

const resolvePhotoHeight = (
  width: number,
  originalWidth: number,
  originalHeight: number,
): number => Math.round((width / originalWidth) * originalHeight);

const resolvePhotoUrl = (
  photoId: string,
  width?: number,
  height?: number,
): string => {
  if (width === undefined || height === undefined) {
    return `/media/photo/${photoId}`;
  }

  return `/media/photo/${photoId}/${width}/${height}`;
};

const resolveAttribution = (photo: AppContextPhotoMetadata): string | null =>
  photo.copyright ?? photo.photographer;

const formatShutterSpeed = (exposureTime: number): string => {
  if (exposureTime >= 1) {
    return `${exposureTime}s`;
  }

  return `1/${Math.round(1 / exposureTime)} sec`;
};

const formatAperture = (aperture: number): string => `f/${aperture}`;

const formatFocalLength = (focalLength: number): string =>
  `${Math.round(focalLength)}mm`;

const resolvePhotoMeta = (
  photo: AppContextPhotoMetadata,
  metadataLabels: AppStateMetadataLabels,
): readonly AppRenderContextPhotoMetaGroup[] => {
  const contextItems: AppRenderContextPhotoMetaItem[] = [];
  const settingsItems: AppRenderContextPhotoMetaItem[] = [];

  const formatIso = (iso: number): string =>
    `ISO ${iso.toLocaleString("en-GB")}`;

  if (photo.readableLocation) {
    contextItems.push({
      id: "location",
      label: metadataLabels.location.label,
      description: metadataLabels.location.description ?? null,
      value: photo.readableLocation,
    });
  }

  if (photo.capturedAt) {
    contextItems.push({
      id: "capturedAt",
      label: metadataLabels.capturedAt.label,
      description: metadataLabels.capturedAt.description ?? null,
      value: formatDate(photo.capturedAt),
    });
  }

  if (photo.exposureTime) {
    settingsItems.push({
      id: "shutterSpeed",
      label: metadataLabels.shutterSpeed.label,
      description: metadataLabels.shutterSpeed.description ?? null,
      value: formatShutterSpeed(photo.exposureTime),
    });
  }

  if (photo.aperture) {
    settingsItems.push({
      id: "aperture",
      label: metadataLabels.aperture.label,
      description: metadataLabels.aperture.description ?? null,
      value: formatAperture(photo.aperture),
    });
  }

  if (photo.focalLength) {
    settingsItems.push({
      id: "focalLength",
      label: metadataLabels.focalLength.label,
      description: metadataLabels.focalLength.description ?? null,
      value: formatFocalLength(photo.focalLength),
    });
  }

  if (photo.iso) {
    settingsItems.push({
      id: "iso",
      label: metadataLabels.iso.label,
      description: metadataLabels.iso.description ?? null,
      value: formatIso(photo.iso),
    });
  }

  return [
    ...(contextItems.length > 0
      ? [{ kind: "context" as const, items: contextItems }]
      : []),
    ...(settingsItems.length > 0
      ? [{ kind: "settings" as const, items: settingsItems }]
      : []),
  ];
};

export const resolvePhotoAppRenderContext = (
  photo: AppContextPhotoMetadata,
  metadataLabels: AppStateMetadataLabels,
): AppRenderContextPhoto => {
  const srcset = PHOTO_SRCSET_WIDTHS.map((width) => {
    const height = resolvePhotoHeight(width, photo.width, photo.height);

    return `${resolvePhotoUrl(photo.id, width, height)} ${width}w`;
  });

  return {
    id: photo.id,
    title: photo.title,
    alt: photo.alt,
    commentary: photo.commentary,
    readableLocation: photo.readableLocation,
    capturedAt: photo.capturedAt,
    width: photo.width,
    height: photo.height,
    src: resolvePhotoUrl(photo.id),
    srcset,
    sizes: "(min-width: 1200px) 1200px, 100vw",
    attribution: resolveAttribution(photo),
    ratio: normaliseDimensionsToBase(photo.width, photo.height),
    meta: resolvePhotoMeta(photo, metadataLabels),
  };
};
