// src/shared/types/content/modules/photo-pair.module.content.shared.app-init.type.ts

import type { PhotoPairModuleContentAuthored } from "../../../../content-schema/content/modules/photo-pair.module.content.content-schema.authored.type";
import type { PhotoComponentContentAppInit } from "../components/photo.component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type PhotoPairModuleContentAppInit = OmitAndReplace<
  PhotoPairModuleContentAuthored,
  Readonly<{
    photos: readonly [
      PhotoComponentContentAppInit,
      PhotoComponentContentAppInit,
    ];
  }>
>;
