// src/app/life-cycle/app-render/document/page/body/modules/photo-sequence/photo-sequence.module.body.page.document.app-render.tsx

import type { PhotoSequenceModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/photo-sequence/photo-sequence.module.content.page.document.app-render-context.type";

import { PhotoObject } from "../../components/photo-object/photo-object.component.body.page.document.app-render";

type Props = Readonly<{
  module: PhotoSequenceModuleContentAppRenderContext;
}>;

export const PhotoSequenceModule = ({ module }: Props) => (
  <figure className="m-photo-sequence">
    <div
      className="m-photo-sequence__items"
      role="group"
      aria-label="Photographic sequence"
    >
      {module.photos.map((item) => (
        <div className="m-photo-sequence__item" key={item.photo.id}>
          <PhotoObject
            photo={item.photo}
            sizes="(min-width: 1024px) 55vw, 85vw"
          />
        </div>
      ))}
    </div>

    {module.caption !== null && (
      <figcaption className="m-photo-sequence__caption">
        {module.caption}
      </figcaption>
    )}
  </figure>
);
