// src/app/types/photo/photo.app-resolve.type.ts

import type { PhotoAppInit } from "../../../shared/types/assets/photo.asset.shared.app-init.type";
import type { OmitAndReplace } from "../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PhotoAppResolve = OmitAndReplace<
  PhotoAppInit,
  Readonly<{
    dimensions: Readonly<{
      width: number;
      height: number;
    }>;
  }>
>;
