// src/shared/types/assets/photo.asset.shared.app-init.type.ts

import type {
  PhotoAssetAuthored,
  PhotoSpeciesAuthored,
} from "../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

export type PhotoSpeciesAppInit = PhotoSpeciesAuthored &
  Readonly<{
    taxonRank: NonNullable<PhotoSpeciesAuthored["taxonRank"]>;
  }>;

export type PhotoAppInit = Omit<PhotoAssetAuthored, "species"> &
  Readonly<{
    species: readonly PhotoSpeciesAppInit[] | null;
  }>;
