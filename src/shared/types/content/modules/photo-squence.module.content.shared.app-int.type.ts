// src/shared/types/content/modules/photo-squence.module.content.shared.app-int.type.ts

import type { PhotoSequenceModuleContentAuthored } from "../../../../content-schema/content/modules/photo-sequence.module.content.content-schema.authored.type";
import type { PhotoComponentContentAppInit } from "../components/photo.component.content.shared.app-init.type";

export type PhotoSequenceModuleContentAppInit = Omit<
  PhotoSequenceModuleContentAuthored,
  "photos" | "caption"
> & {
  photos: readonly PhotoComponentContentAppInit[];
  caption: string | null;
};
