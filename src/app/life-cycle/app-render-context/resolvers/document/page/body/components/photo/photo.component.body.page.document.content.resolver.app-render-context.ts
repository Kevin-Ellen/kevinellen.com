// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/photo/photo.component.body.page.document.content.resolver.app-render-context.ts

import type { PhotoComponentContentAppResolve } from "../../../../../../../../types/document/page/content/components/photo/photo.component.content.page.document.app-resolve.type";
import type { PhotoComponentContentAppRenderContext } from "../../../../../../../../types/document/page/content/components/photo/photo.component.content.page.document.app-render-context.type";

import { resolvePhotoAppRenderContext } from "../../../../../primitives/photo/photo.primitive.resolver.app-render-context";

type Input = Readonly<{
  content: PhotoComponentContentAppResolve;
}>;

export const resolvePhotoComponentContentAppRenderContext = ({
  content,
}: Input): PhotoComponentContentAppRenderContext => {
  const { photo, alt, commentary, ...rest } = content;

  return {
    ...rest,
    photo: resolvePhotoAppRenderContext({
      photo,
      alt,
      commentary,
    }),
  };
};
