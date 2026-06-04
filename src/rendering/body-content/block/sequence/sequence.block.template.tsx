// src/rendering/body-content/block/sequence/sequence.block.template.tsx

import type { AppRenderContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-render-context.sequence.block.types";
import type {
  AppRenderContextPhotoMetaGroup,
  AppRenderContextPhotoMetaItem,
} from "@shared-types/media/photo/app-render-context.photo.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";
import { InlineContentTemplate } from "@rendering/body-content/inline/inline.template";

type SequenceBlockTemplateProps = Readonly<{
  block: AppRenderContextSequenceBlock;
}>;

type SequenceMetaItemTemplateProps = Readonly<{
  item: AppRenderContextPhotoMetaItem;
}>;

type SequenceMetaGroupTemplateProps = Readonly<{
  group: AppRenderContextPhotoMetaGroup;
}>;

type SequenceMetaTemplateProps = Readonly<{
  meta: readonly AppRenderContextPhotoMetaGroup[];
}>;

const SequenceMetaTermTemplate = ({ item }: SequenceMetaItemTemplateProps) => {
  if (!item.description) {
    return item.label;
  }

  return <abbr title={item.description}>{item.label}</abbr>;
};

const SequenceMetaDetailTemplate = ({
  item,
}: SequenceMetaItemTemplateProps) => {
  if (!item.datetime) {
    return item.value;
  }

  return <time dateTime={item.datetime}>{item.value}</time>;
};

const SequenceMetaItemTemplate = ({ item }: SequenceMetaItemTemplateProps) => (
  <div className="m-sequence__meta-item">
    <dt className="m-sequence__meta-term">
      <SequenceMetaTermTemplate item={item} />
    </dt>

    <dd className="m-sequence__meta-detail">
      <SequenceMetaDetailTemplate item={item} />
    </dd>
  </div>
);

const SequenceMetaGroupTemplate = ({
  group,
}: SequenceMetaGroupTemplateProps) => (
  <dl
    className={`m-sequence__meta${
      group.kind === "settings" ? " m-sequence__meta--settings" : ""
    }`}
  >
    {group.items.map((item, index) => (
      <SequenceMetaItemTemplate
        key={`sequence-meta-item:${index}`}
        item={item}
      />
    ))}
  </dl>
);

const SequenceMetaTemplate = ({ meta }: SequenceMetaTemplateProps) => {
  if (meta.length === 0) {
    return null;
  }

  return (
    <div className="m-sequence__meta-group">
      {meta.map((group, index) => (
        <SequenceMetaGroupTemplate
          key={`sequence-meta-group:${index}`}
          group={group}
        />
      ))}
    </div>
  );
};

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

        <SequenceMetaTemplate meta={block.meta} />
      </figcaption>
    </figure>
  );
};
