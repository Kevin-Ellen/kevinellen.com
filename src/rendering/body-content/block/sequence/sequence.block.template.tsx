// src/rendering/body-content/block/sequence/sequence.block.template.tsx

import type { AppRenderContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-render-context.sequence.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";
import { InlineContentTemplate } from "@rendering/body-content/inline/inline.template";

type SequenceBlockTemplateProps = Readonly<{
  block: AppRenderContextSequenceBlock;
}>;

export const SequenceBlockTemplate = ({
  block,
}: SequenceBlockTemplateProps) => {
  const immersiveClass = block.immersive ? " m-sequence--immersive" : "";

  return (
    <figure
      className={`m-contentBlock m-sequence ${getBlockFlowClassName(
        block.flow,
      )}${immersiveClass}`}
    >
      <div className="m-sequence__items">
        {block.photos.map((item) => (
          <figure
            key={`sequence-photo:${item.position}:${item.photo.id}`}
            className="m-sequence__item"
            data-photo-id={item.photo.id}
            data-sequence-position={item.position}
          >
            <img
              className="m-sequence__object"
              src={item.photo.src}
              srcSet={item.photo.srcset.join(", ")}
              sizes={item.photo.sizes}
              width={item.photo.width}
              height={item.photo.height}
              alt={item.photo.alt}
              loading={block.immersive ? "eager" : "lazy"}
              decoding="async"
            />
          </figure>
        ))}
      </div>

      <figcaption className="m-sequence__annotation">
        <div className="m-sequence__caption">
          <InlineContentTemplate content={block.caption} />
        </div>
      </figcaption>
    </figure>
  );
};
