// shared-types/media/photo/app-render-context.render-photo.types.ts

import type { MetadataLabelId } from "@shared-types/config/metadata-labels/id.metadata-labels.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { AppRenderContextRenderImage } from "@shared-types/media/render-image/app-render-context.render-image.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type OmittedFields =
  | "sourceFileName"
  | "cloudflareImageId"
  | "cloudflareUploadedAt"
  | "cameraMake"
  | "cameraModel"
  | "lensModel"
  | "exposureTime"
  | "aperture"
  | "iso"
  | "focalLength"
  | "focalLength35mm"
  | "latitude"
  | "longitude"
  | "resolvedLocation"
  | "photographer"
  | "copyright"
  | "readableLocation"
  | "capturedAt";

type ReplacementFields = AppRenderContextRenderImage &
  Readonly<{
    attribution: string | null;
    meta: readonly AppRenderContextPhotoMetaGroup[];
  }>;

export type AppRenderContextPhotoMetaItem = Readonly<{
  id: MetadataLabelId;
  label: string;
  description: string | null;
  value: string;
  datetime?: string;
}>;

export type AppRenderContextPhotoMetaGroup = Readonly<{
  kind: "context" | "settings";
  items: readonly AppRenderContextPhotoMetaItem[];
}>;

export type AppRenderContextPhoto = ReplaceAndOmit<
  AppContextPhotoMetadata,
  ReplacementFields,
  OmittedFields
>;
