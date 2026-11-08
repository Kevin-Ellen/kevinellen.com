// src/app/life-cycle/app-render/document/page/body/modules/photo-pair/photo-pair.module.body.page.document.app-render.tsx

import type { PhotoPairModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/photo-pair/photo-pair.module.content.page.document.app-render-context.type";

import { PhotoObject } from "../../components/photo-object/photo-object.component.body.page.document.app-render";

const PHOTO_PAIR_SIZES = "(min-width: 60rem) 50vw, 100vw";

type Props = Readonly<{
  module: PhotoPairModuleContentAppRenderContext;
}>;

export const PhotoPairModule = ({ module }: Props) => (
  <div className="m-photo-pair">
    <div className="m-photo-pair__items">
      {module.photos.map(({ photo }) => (
        <PhotoObject
          key={photo.id}
          photo={photo}
          className="m-photo-pair__item"
          sizes={PHOTO_PAIR_SIZES}
        />
      ))}
    </div>
  </div>
);
