// src/shared/resolvers/content/modules/featured-photo/featured-photo.module.content.resolver.shared.app-init.ts

import type { FeaturedPhotoModuleContentAuthored } from "../../../../../content-schema/content/modules/featured-photo.module.content.content-schema.authored.type";
import type { FeaturedPhotoModuleContentAppInit } from "../../../../types/content/modules/featured-photo.module.content.shared.app-int.type";

import { resolvePhotoComponentContentAppInit } from "../../components/photo/photo.component.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: FeaturedPhotoModuleContentAuthored;
}>;

export const resolveFeaturedPhotoModuleContentAppInit = ({
  authored,
}: Input): FeaturedPhotoModuleContentAppInit => {
  const photo = resolvePhotoComponentContentAppInit({
    authored: {
      ...authored,
      kind: "photo",
    },
  });

  return {
    ...photo,
    kind: "featuredPhoto",
    wide: true,
  };
};
