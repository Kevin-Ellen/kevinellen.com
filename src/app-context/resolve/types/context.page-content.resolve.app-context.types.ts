// src/app-context/resolve/page/content/context.page-content.resolve.app-context.types.ts

import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { AppStateMetadataLabels } from "@shared-types/config/metadata-labels/app-state.metadata-labels.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { PhotoId } from "@shared-types/media/photo/id.photo.types";
import type { RoutingPagination } from "@request/types/request.types";
import type { AppContextImageDeliveryConfig } from "@shared-types/config/image-delivery/app-context.image-delivery.types";

export type AppContextPageContentResolverContext = Readonly<{
  photos: readonly AppContextPhotoMetadata[];
  homepageStripPhotoIds: readonly PhotoId[];
  metadataLabels: AppStateMetadataLabels;
  resolveInternalLink: (link: AppStateInternalLink) => AppContextInternalLink;
  publicPages: readonly AppStatePageDefinition[];
  routingPagination: RoutingPagination | null;
  resolvePhoto: (photoId: string) => AppContextPhotoMetadata | null;
  currentPageSlug: string | null;
  imageDelivery: AppContextImageDeliveryConfig;
}>;
