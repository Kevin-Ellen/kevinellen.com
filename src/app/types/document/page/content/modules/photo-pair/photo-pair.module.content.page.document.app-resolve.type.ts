// src/app/types/document/page/content/modules/photo-pair/photo-pair.module.content.page.document.app-resolve.type.ts

import type { PhotoPairModuleContentAppInit } from "../../../../../../../shared/types/content/modules/photo-pair.module.content.shared.app-init.type";
import type { PhotoComponentContentAppResolve } from "../../components/photo/photo.component.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PhotoPairModuleContentAppResolve = OmitAndReplace<
  PhotoPairModuleContentAppInit,
  Readonly<{
    photos: readonly [
      PhotoComponentContentAppResolve,
      PhotoComponentContentAppResolve,
    ];
  }>
>;
