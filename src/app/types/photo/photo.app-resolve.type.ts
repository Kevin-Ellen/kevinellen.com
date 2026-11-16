// src/app/types/photo/photo.app-resolve.type.ts

import type { PhotoAppInit } from "../../../shared/types/assets/photo.asset.shared.app-init.type";
import type { OmitAndReplace } from "../../../shared/types/utilities/omit-replace.utility.shared.type";
import type { JournalLedgerPhotoAppInit } from "../../../shared/types/content/kv-ledger.content.shared.type";

export type PhotoAppResolve = OmitAndReplace<
  PhotoAppInit,
  Readonly<{
    dimensions: Readonly<{
      width: number;
      height: number;
    }>;
  }>
>;

export type BundledRegistryPhotoAppResolve = Readonly<{
  src: string;
  width: number | null;
  height: number | null;
}>;

export type PublishedRegistryPhotoAppResolve = JournalLedgerPhotoAppInit;
