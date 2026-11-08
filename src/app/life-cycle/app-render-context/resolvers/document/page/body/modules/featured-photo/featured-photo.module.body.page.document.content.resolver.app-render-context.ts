// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/featured-photo/featured-photo.module.body.page.document.content.resolver.app-render-context.ts

import type { FeaturedPhotoModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/featured-photo/featured-photo.module.content.page.document.app-resolve.type";
import type { FeaturedPhotoModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/featured-photo/featured-photo.module.content.page.document.app-render-context.type";

import { resolvePhotoAppRenderContext } from "../../../../../primitives/photo/photo.primitive.resolver.app-render-context";

type Input = Readonly<{
  content: FeaturedPhotoModuleContentAppResolve;
}>;

export const resolveFeaturedPhotoModuleContentAppRenderContext = ({
  content,
}: Input): FeaturedPhotoModuleContentAppRenderContext => ({
  kind: content.kind,
  wide: content.wide,

  photo: resolvePhotoAppRenderContext({
    photo: content.photo,
    alt: content.alt,
    commentary: content.commentary,
  }),
});
