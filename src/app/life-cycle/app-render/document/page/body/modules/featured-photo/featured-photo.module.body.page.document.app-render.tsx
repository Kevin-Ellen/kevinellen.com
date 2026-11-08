// src/app/life-cycle/app-render/document/page/body/modules/featured-photo/featured-photo.module.body.page.document.app-render.tsx

import type { FeaturedPhotoModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/featured-photo/featured-photo.module.content.page.document.app-render-context.type";

import { PhotoObject } from "../../components/photo-object/photo-object.component.body.page.document.app-render";

type Props = Readonly<{
  module: FeaturedPhotoModuleContentAppRenderContext;
}>;

export const FeaturedPhotoModule = ({ module }: Props) => (
  <div className="m-featured-photo">
    <div className="l-frame">
      <PhotoObject photo={module.photo} wide={module.wide} priority />
    </div>
  </div>
);
