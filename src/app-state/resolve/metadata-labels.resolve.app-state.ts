// src/app-state/resolve/metadata-labels.resolve.app-state.ts

import type { AppStateMetadataLabels } from "@shared-types/config/metadata-labels/app-state.metadata-labels.types";

import { appStateMetadataLabelsAuthored } from "@app-state/config/metadata-labels/authored.metadata-labels.app-state";

export const appStateResolveMetadataLabels: AppStateMetadataLabels =
  appStateMetadataLabelsAuthored;
