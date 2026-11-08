// src/shared/resolvers/content/modules/photo-pair/photo-pair.module.content.resolver.shared.app-init.ts

import type { PhotoPairModuleContentAuthored } from "../../../../../content-schema/content/modules/photo-pair.module.content.content-schema.authored.type";
import type { PhotoPairModuleContentAppInit } from "../../../../types/content/modules/photo-pair.module.content.shared.app-init.type";

import { resolvePhotoComponentContentAppInit } from "../../components/photo/photo.component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: PhotoPairModuleContentAuthored;
}>;

export const resolvePhotoPairModuleContentAppInit = ({
  authored,
}: Input): PhotoPairModuleContentAppInit => ({
  ...authored,
  photos: [
    resolvePhotoComponentContentAppInit({
      authored: authored.photos[0],
    }),
    resolvePhotoComponentContentAppInit({
      authored: authored.photos[1],
    }),
  ],
});
