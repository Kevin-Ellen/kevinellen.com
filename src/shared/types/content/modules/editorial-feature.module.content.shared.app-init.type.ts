// src/shared/types/content/modules/editorial-feature.module.content.shared.app-init.type.ts

import type { EditorialFeatureModuleContentAuthored } from "../../../../content-schema/content/modules/editorial-feature.module.content.content-schema.authored.type";
import type { ComponentContentAppInit } from "../components/component.content.shared.app-init.type";
import type { EditorialPhotoComponentContentAppInit } from "../components/editorial-photo.component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type EditorialFeatureModuleContentAppInit = OmitAndReplace<
  EditorialFeatureModuleContentAuthored,
  {
    components: readonly ComponentContentAppInit[];
    media: EditorialPhotoComponentContentAppInit;
  }
>;
