// src/app/config/metadata.photo.config.ts

import type { PhotoMetadataConfig } from "@app/config/metadata.photo.config.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const photoMetadataConfig: PhotoMetadataConfig = deepFreeze({
  location: {
    label: "Location",
  },
  shutterSpeed: {
    label: "Shutter speed",
    description: "How long the camera sensor was exposed to light.",
  },
  aperture: {
    label: "Aperture",
    description: "The size of the lens opening controlling light intake.",
  },
  focalLength: {
    label: "Focal length",
    description: "The zoom level or field of view used for the photograph.",
  },
  iso: {
    label: "ISO",
    description: "The camera’s sensitivity to light.",
  },
});
