// shared-types/config/metadata-labels/authored.metadata-labels.types.ts

import type { MetadataLabelId } from "@shared-types/config/metadata-labels/id.metadata-labels.types";

export type AuthoredMetadataLabel = Readonly<{
  label: string;
  description?: string;
}>;

export type AuthoredMetadataLabels = Readonly<{
  [K in MetadataLabelId]: AuthoredMetadataLabel;
}>;
