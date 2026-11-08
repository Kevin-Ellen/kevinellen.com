// src/shared/types/content/modules/featured-photo.module.content.shared.app-int.type.ts

import type { PhotoComponentContentAppInit } from "../components/photo.component.content.shared.app-init.type";

export type FeaturedPhotoModuleContentAppInit = Readonly<
  Omit<PhotoComponentContentAppInit, "kind" | "wide"> & {
    kind: "featuredPhoto";
    wide: true;
  }
>;
