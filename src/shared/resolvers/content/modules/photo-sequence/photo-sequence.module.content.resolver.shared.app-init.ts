// src/shared/resolvers/content/modules/photo-sequence/photo-sequence.module.content.resolver.shared.app-init.ts

import type { PhotoSequenceModuleContentAuthored } from "../../../../../content-schema/content/modules/photo-sequence.module.content.content-schema.authored.type";
import type { PhotoSequenceModuleContentAppInit } from "../../../../types/content/modules/photo-squence.module.content.shared.app-int.type";

import { resolvePhotoComponentContentAppInit } from "../../components/photo/photo.component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: PhotoSequenceModuleContentAuthored;
}>;

export const resolvePhotoSequenceModuleAppInit = ({
  authored,
}: Input): PhotoSequenceModuleContentAppInit => ({
  ...authored,
  photos: authored.photos.map((photo) =>
    resolvePhotoComponentContentAppInit({ authored: photo }),
  ),
  caption: authored.caption ?? null,
});
