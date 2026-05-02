// shared-types/media/photo/app-render-context.photo.types.ts

import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { MetadataLabelId } from "@shared-types/config/metadata-labels/id.metadata-labels.types";

import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextPhotoOmittedFields =
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
  | "copyright";

type AppRenderContextPhotoReplacementFields = Readonly<{
  src: string;
  srcset: readonly string[];
  sizes: string;
  attribution: string | null;
  ratio: Readonly<{
    width: number;
    height: number;
  }>;
  meta: readonly AppRenderContextPhotoMetaGroup[];
}>;

export type AppRenderContextPhotoMetaItem = Readonly<{
  id: MetadataLabelId;
  label: string;
  description: string | null;
  value: string;
}>;

export type AppRenderContextPhotoMetaGroup = Readonly<{
  kind: "context" | "settings";
  items: readonly AppRenderContextPhotoMetaItem[];
}>;

export type AppRenderContextPhoto = ReplaceAndOmit<
  AppContextPhotoMetadata,
  AppRenderContextPhotoReplacementFields,
  AppRenderContextPhotoOmittedFields
>;
