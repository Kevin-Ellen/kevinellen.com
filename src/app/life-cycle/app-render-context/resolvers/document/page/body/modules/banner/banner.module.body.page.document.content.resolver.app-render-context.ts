// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/banner/banner.module.body.page.document.content.resolver.app-render-context.ts

import type { BannerModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/banner/banner.module.content.page.document.app-resolve.type";
import type { BannerModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/banner/banner.module.content.page.document.app-render-context.type";

import { resolveComponentContentAppRenderContext } from "../../components/component.body.page.document.content.resolver.app-render-context";
import { resolveEditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: BannerModuleContentAppResolve;
}>;

export const resolveBannerModuleContentAppRenderContext = ({
  content,
}: Input): BannerModuleContentAppRenderContext => ({
  ...content,
  media: resolveEditorialPhotoComponentContentAppRenderContext({
    content: content.media,
  }),
  components: content.components.map((component) =>
    resolveComponentContentAppRenderContext({
      content: component,
    }),
  ),
});
