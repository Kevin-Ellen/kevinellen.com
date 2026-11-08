// src/shared/resolvers/assets/photo/photo.asset.resolver.shared.app-init.ts

import type { PhotoAssetAuthored } from "../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";
import type { PhotoAppInit } from "../../../types/assets/photo.asset.shared.app-init.type";

export const resolvePhotoAppInit = (
  photo: PhotoAssetAuthored,
): PhotoAppInit => ({
  ...photo,
  species:
    photo.species?.map((species) => ({
      ...species,
      taxonRank: "species" as const,
    })) ?? null,
});
