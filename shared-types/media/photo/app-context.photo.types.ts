// shared-types/media/photo/app-context.photo.types.ts

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextPhotoMetadataDeterministicFields = Readonly<{
  cloudflareImageId: string;
}>;

export type AppContextPhotoMetadata = Replace<
  AuthoredPhotoMetadata,
  AppContextPhotoMetadataDeterministicFields
>;
