// src/shared/types/content/modules/banner.module.content.shared.app-init.type.ts

import type { BannerModuleContentAuthored } from "../../../../content-schema/content/modules/banner.module.content.content-schema.authored.type";
import type { ComponentContentAppInit } from "../components/component.content.shared.app-init.type";
import type { EditorialPhotoComponentContentAppInit } from "../components/editorial-photo.component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type BannerModuleContentAppInit = OmitAndReplace<
  BannerModuleContentAuthored,
  {
    media: EditorialPhotoComponentContentAppInit;
    components: readonly ComponentContentAppInit[];
  }
>;
