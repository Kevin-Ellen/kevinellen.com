// packages/shared-types/src/content/modules/list/hero.module.types.ts

import { PhotoId } from "@shared-types/content/photos.types";

export type HeroModuleAuthored = {
  kind: "hero";
  immersive?: boolean;
  photoId: PhotoId;
};
