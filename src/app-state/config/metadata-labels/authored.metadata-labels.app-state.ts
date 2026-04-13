// src/app-state/config/metadata-labels/authored.metadata-labels.app-state.ts

import type { AuthoredMetadataLabels } from "@shared-types/config/metadata-labels/authored.metadata-labels.types";
import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateMetadataLabelsAuthored: AuthoredMetadataLabels =
  deepFreeze({
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
    published: {
      label: "Published",
    },
    lastUpdated: {
      label: "Last updated",
    },
    capturedAt: {
      label: "Captured",
    },
    author: {
      label: "Author",
    },
  });
