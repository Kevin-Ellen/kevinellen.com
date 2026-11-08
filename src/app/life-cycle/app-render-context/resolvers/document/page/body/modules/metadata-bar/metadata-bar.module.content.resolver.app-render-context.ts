// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/metadata-bar/metadata-bar.module.content.resolver.app-render-context.ts

import type { MetadataBarModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/metadata-bar/metadata-bar.content.page.document.app-resolve.type";
import type { MetadataBarModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/metadata-bar/metadata-bar.content.page.document.app-render-context.type";

import { resolveSvgReferenceAppRenderContext } from "../../../../../primitives/svg/svg.primitive.resolver.app-render-context";

type Input = Readonly<{
  content: MetadataBarModuleContentAppResolve;
}>;

export const resolveMetadataBarModuleContentAppRenderContext = ({
  content,
}: Input): MetadataBarModuleContentAppRenderContext => ({
  ...content,

  cameras: {
    ...content.cameras,
    icon: resolveSvgReferenceAppRenderContext({
      reference: content.cameras.icon,
    }),
  },

  lenses: {
    ...content.lenses,
    icon: resolveSvgReferenceAppRenderContext({
      reference: content.lenses.icon,
    }),
  },

  location: {
    ...content.location,
    icon: resolveSvgReferenceAppRenderContext({
      reference: content.location.icon,
    }),
  },
});
