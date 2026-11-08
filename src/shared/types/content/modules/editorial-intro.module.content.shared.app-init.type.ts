// src/shared/types/content/modules/editorial-intro.module.content.shared.app-init.type.ts

import type { EditorialIntroModuleContentAuthored } from "../../../../content-schema/content/modules/editorial-intro.module.content.content-schema.authored.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";
import type { EditorialPhotoComponentContentAppInit } from "../components/editorial-photo.component.content.shared.app-init.type";

export type EditorialIntroModuleContentAppInit = OmitAndReplace<
  EditorialIntroModuleContentAuthored,
  {
    location: string | null;
    portrait: EditorialPhotoComponentContentAppInit | null;
  }
>;
