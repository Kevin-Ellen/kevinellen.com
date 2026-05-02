// src/app-context/resolve/page/content/context.page-content.resolve.app-context.types.ts

import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { AppStateMetadataLabels } from "@shared-types/config/metadata-labels/app-state.metadata-labels.types";

export type AppContextPageContentResolverContext = Readonly<{
  photos: readonly AppContextPhotoMetadata[];
  metadataLabels: AppStateMetadataLabels;
  resolveInternalLink: (link: AppStateInternalLink) => AppContextInternalLink;
}>;
