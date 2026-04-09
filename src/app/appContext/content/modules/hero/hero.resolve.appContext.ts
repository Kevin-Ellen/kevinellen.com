// src/app/appContext/content/modules/hero/hero.resolve.appContext.ts

import type { AppContextHeroModule } from "@app/appContext/content/modules/hero/hero.module.appContext.types";
import type {
  AppContextHeroMetaItem,
  AppContextHeroSettingItem,
} from "@app/appContext/content/modules/hero/hero.module.appContext.types";
import type { HeroModuleAuthored } from "@shared-types/content/modules/hero/hero.module.types";
import type { AppContextModuleResolverDependencies } from "@app/appContext/content/modules/module.registry.appContext";

const formatExposureTime = (value: number): string => {
  const reciprocal = Math.round(1 / value);
  return `1/${reciprocal} sec`;
};

const formatAperture = (value: number): string => {
  return `f/${value}`;
};

const formatFocalLength = (value: number): string => {
  return `${value}mm`;
};

const formatIso = (value: number): string => {
  return `ISO ${value}`;
};

const buildMeta = (
  readableLocation: string | undefined,
  dependencies: AppContextModuleResolverDependencies,
): readonly AppContextHeroMetaItem[] => {
  const items: AppContextHeroMetaItem[] = [];

  if (readableLocation) {
    items.push({
      key: "location",
      label: dependencies.appState.photoMetadata.location.label,
      value: readableLocation,
      description: dependencies.appState.photoMetadata.location.description,
    });
  }

  return items;
};

const buildSettings = (
  photo: ReturnType<AppContextModuleResolverDependencies["getPhotoRecordById"]>,
  dependencies: AppContextModuleResolverDependencies,
): readonly AppContextHeroSettingItem[] => {
  const items: AppContextHeroSettingItem[] = [];
  const config = dependencies.appState.photoMetadata;

  if (photo.exposureTime) {
    items.push({
      key: "shutterSpeed",
      label: config.shutterSpeed.label,
      shortValue: formatExposureTime(photo.exposureTime),
      description: config.shutterSpeed.description,
    });
  }

  if (photo.aperture) {
    items.push({
      key: "aperture",
      label: config.aperture.label,
      shortValue: formatAperture(photo.aperture),
      description: config.aperture.description,
    });
  }

  if (photo.focalLength) {
    items.push({
      key: "focalLength",
      label: config.focalLength.label,
      shortValue: formatFocalLength(photo.focalLength),
      description: config.focalLength.description,
    });
  }

  if (photo.iso) {
    items.push({
      key: "iso",
      label: config.iso.label,
      shortValue: formatIso(photo.iso),
      description: config.iso.description,
    });
  }

  return items;
};

export const resolveHeroAppContext = (
  module: HeroModuleAuthored,
  dependencies: AppContextModuleResolverDependencies,
): AppContextHeroModule => {
  const photo = dependencies.getPhotoRecordById(module.photoId);

  if (!photo.commentary) {
    throw new Error(
      `Hero photo "${photo.id}" is missing commentary for required caption.`,
    );
  }

  return {
    kind: "hero",
    immersive: module.immersive ?? false,
    photo,
    caption: photo.commentary,
    meta: buildMeta(photo.readableLocation, dependencies),
    settings: buildSettings(photo, dependencies),
  };
};
