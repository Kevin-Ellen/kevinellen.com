// src/shared/resolvers/content/modules/metadata-bar/metadata-bar.module.content.resolver.shared.app-init.ts

import type { MetadataBarModuleContentAuthored } from "../../../../../content-schema/content/modules/metadata-bar.module.content.content-schema.authored.type";
import type { MetadataBarModuleContentAppInit } from "../../../../types/content/modules/metadata-bar.module.content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../../../types/assets/svg.assets.config.app-init.type";

import { resolveSvgReferenceAppInit } from "../../primitives/svg/svg.primitive.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: MetadataBarModuleContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
}>;

export const resolveMetadataBarModuleContentAppInit = ({
  authored,
  svgAssets,
}: Input): MetadataBarModuleContentAppInit => ({
  kind: authored.kind,
  heading: authored.heading ?? "Equipment for this entry",

  cameras: {
    icon: resolveSvgReferenceAppInit({
      authored: { id: "icon-camera" },
      registry: svgAssets,
    }),
    entries: authored.cameras,
  },

  lenses: {
    icon: resolveSvgReferenceAppInit({
      authored: { id: "icon-aperture" },
      registry: svgAssets,
    }),
    entries: authored.lenses,
  },

  location: {
    icon: resolveSvgReferenceAppInit({
      authored: { id: "icon-location-dot" },
      registry: svgAssets,
    }),
    entries: authored.location,
  },
});
