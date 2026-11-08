// src/content-schema/content/modules/featured-photo.module.content.content-schema.authored.type.ts

import type { PhotoComponentContentAuthored } from "../components/photo.component.content.content-schema.authored.type";

export type FeaturedPhotoModuleContentAuthored = Readonly<
  Omit<PhotoComponentContentAuthored, "kind" | "wide"> & {
    kind: "featuredPhoto";
  }
>;
