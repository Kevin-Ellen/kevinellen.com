// src/app/life-cycle/app-resolve/resolvers/content/modules/metadata-bar/metadata-bar.module.content.resolver.app-resolve.ts

import type { MetadataBarModuleContentAppInit } from "../../../../../../../shared/types/content/modules/metadata-bar.module.content.shared.app-init.type";
import type { MetadataBarModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/metadata-bar/metadata-bar.content.page.document.app-resolve.type";

import { resolveSvgReferenceAppResolve } from "../../../primitives/svg/svg.primitive.resolver.app-resolve";

type Input = Readonly<{
  content: MetadataBarModuleContentAppInit;
}>;

export const resolveMetadataBarModuleContentAppResolve = ({
  content,
}: Input): MetadataBarModuleContentAppResolve => ({
  ...content,

  cameras: {
    ...content.cameras,
    icon: resolveSvgReferenceAppResolve({
      reference: content.cameras.icon,
    }),
  },

  lenses: {
    ...content.lenses,
    icon: resolveSvgReferenceAppResolve({
      reference: content.lenses.icon,
    }),
  },

  location: {
    ...content.location,
    icon: resolveSvgReferenceAppResolve({
      reference: content.location.icon,
    }),
  },
});
