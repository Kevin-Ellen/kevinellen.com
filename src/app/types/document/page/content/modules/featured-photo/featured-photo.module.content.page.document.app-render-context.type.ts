// src/app/types/document/page/content/modules/featured-photo/featured-photo.module.content.page.document.app-render-context.type.ts

import type { FeaturedPhotoModuleContentAppResolve } from "./featured-photo.module.content.page.document.app-resolve.type";
import type { PhotoAppRenderContext } from "../../../../../photo/photo.app-render-context.type";

export type FeaturedPhotoModuleContentAppRenderContext = Readonly<
  Pick<FeaturedPhotoModuleContentAppResolve, "kind" | "wide"> & {
    photo: PhotoAppRenderContext;
  }
>;
