// src/shared/types/content/components/photo.component.content.shared.app-init.type.ts

import type { PhotoComponentContentAuthored } from "../../../../content-schema/content/components/photo.component.content.content-schema.authored.type";
import type { OmitAndReplace } from "../../../types/utilities/omit-replace.utility.shared.type";

export type PhotoComponentContentAppInit = OmitAndReplace<
  PhotoComponentContentAuthored,
  {
    expandable: boolean;
  }
>;
