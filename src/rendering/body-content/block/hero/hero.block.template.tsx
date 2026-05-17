// src/rendering/body-content/block/hero/hero.block.template.tsx

import type { AppRenderContextHeroBlock } from "@shared-types/page-content/block/hero/app-render-context.hero.block.types";
import type {
  AppRenderContextPhotoMetaGroup,
  AppRenderContextPhotoMetaItem,
} from "@shared-types/media/photo/app-render-context.photo.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";

type HeroBlockTemplateProps = Readonly<{
  block: AppRenderContextHeroBlock;
}>;

type PhotoMetaItemTemplateProps = Readonly<{
  item: AppRenderContextPhotoMetaItem;
}>;

type PhotoMetaGroupTemplateProps = Readonly<{
  group: AppRenderContextPhotoMetaGroup;
}>;

type PhotoMetaTemplateProps = Readonly<{
  meta: readonly AppRenderContextPhotoMetaGroup[];
}>;

const PhotoMetaTermTemplate = ({ item }: PhotoMetaItemTemplateProps) => {
  if (!item.description) {
    return item.label;
  }

  return <abbr title={item.description}>{item.label}</abbr>;
};

const PhotoMetaDetailTemplate = ({ item }: PhotoMetaItemTemplateProps) => {
  if (!item.datetime) {
    return item.value;
  }

  return <time dateTime={item.datetime}>{item.value}</time>;
};

const PhotoMetaItemTemplate = ({ item }: PhotoMetaItemTemplateProps) => (
  <div className="m-photo__meta-item">
    <dt className="m-photo__meta-term">
      <PhotoMetaTermTemplate item={item} />
    </dt>

    <dd className="m-photo__meta-detail">
      <PhotoMetaDetailTemplate item={item} />
    </dd>
  </div>
);

const PhotoMetaGroupTemplate = ({ group }: PhotoMetaGroupTemplateProps) => (
  <dl
    className={`m-photo__meta${
      group.kind === "settings" ? " m-photo__meta--settings" : ""
    }`}
  >
    {group.items.map((item, index) => (
      <PhotoMetaItemTemplate key={`photo-meta-item:${index}`} item={item} />
    ))}
  </dl>
);

const PhotoMetaTemplate = ({ meta }: PhotoMetaTemplateProps) => {
  if (meta.length === 0) {
    return null;
  }

  return (
    <div className="m-photo__meta-group">
      {meta.map((group, index) => (
        <PhotoMetaGroupTemplate
          key={`photo-meta-group:${index}`}
          group={group}
        />
      ))}
    </div>
  );
};

export const HeroBlockTemplate = ({ block }: HeroBlockTemplateProps) => {
  const immersiveClass = block.immersive ? " m-photo--immersive" : "";

  return (
    <figure
      className={`m-contentBlock m-photo ${getBlockFlowClassName(
        block.flow,
      )}${immersiveClass}`}
      data-photo-id={block.photo.id}
    >
      <img
        className="m-photo__object"
        src={block.photo.src}
        srcSet={block.photo.srcset.join(", ")}
        sizes={block.photo.sizes}
        width={block.photo.width}
        height={block.photo.height}
        alt={block.photo.alt}
        loading={block.immersive ? "eager" : "lazy"}
        decoding="async"
      />

      <figcaption className="m-photo__annotation">
        <p className="m-photo__caption">{block.photo.commentary}</p>

        <PhotoMetaTemplate meta={block.photo.meta} />
      </figcaption>
    </figure>
  );
};
