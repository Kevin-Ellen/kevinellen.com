// src/rendering/body-content/block/image-strip/image-strip.block.template.tsx

import type { AppRenderContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";
import { HeadingTemplate } from "@rendering/shared/heading.shared.template";

type ImageStripBlockTemplateProps = Readonly<{
  block: AppRenderContextImageStripBlock;
}>;

type ImageStripImageTemplateProps = Readonly<{
  photo: AppRenderContextImageStripBlock["photos"][number];
}>;

const ImageStripImageTemplate = ({ photo }: ImageStripImageTemplateProps) => (
  <img
    className="m-image-strip__image"
    src={photo.src}
    srcSet={photo.srcset.join(", ")}
    sizes={photo.sizes}
    alt={photo.alt}
    width={photo.width}
    height={photo.height}
    loading="lazy"
    decoding="async"
  />
);

export const ImageStripBlockTemplate = ({
  block,
}: ImageStripBlockTemplateProps) => (
  <section className={`m-image-strip ${getBlockFlowClassName(block.flow)}`}>
    <HeadingTemplate
      heading={block.heading}
      className="m-image-strip__heading"
    />

    <div className="m-image-strip__inner">
      {block.photos.map((photo, index) => (
        <ImageStripImageTemplate key={`image-strip:${index}`} photo={photo} />
      ))}
    </div>
  </section>
);
