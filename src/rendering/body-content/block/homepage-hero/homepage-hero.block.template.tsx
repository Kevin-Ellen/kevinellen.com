// src/rendering/body-content/block/homepage-hero/homepage-hero.block.template.tsx

import type { AppRenderContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";
import { InlineContentTemplate } from "@rendering/body-content/inline/inline.template";
import { LinkTemplate } from "@rendering/shared/link.shared.template";

type HomepageHeroBlockTemplateProps = Readonly<{
  block: AppRenderContextHomepageHeroBlock;
}>;

export const HomepageHeroBlockTemplate = ({
  block,
}: HomepageHeroBlockTemplateProps) => (
  <section className={`m-homepage-hero ${getBlockFlowClassName(block.flow)}`}>
    <div className="m-homepage-hero__media">
      <img
        className="m-homepage-hero__image"
        src={block.photo.src}
        srcSet={block.photo.srcset.join(", ")}
        sizes={block.photo.sizes}
        alt={block.photo.alt}
        width={block.photo.width}
        height={block.photo.height}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>

    <div className="m-homepage-hero__content m-heading">
      {block.eyebrow ? (
        <p className="m-homepage-hero__eyebrow m-heading__eyebrow">
          {block.eyebrow}
        </p>
      ) : null}

      <h1 className="m-homepage-hero__title m-heading__title">{block.title}</h1>

      {block.intro.length > 0 ? (
        <p className="m-homepage-hero__intro m-heading__intro">
          <InlineContentTemplate content={block.intro} />
        </p>
      ) : null}

      {block.primaryLink ? (
        <LinkTemplate
          link={block.primaryLink}
          className="m-homepage-hero__action"
        />
      ) : null}
    </div>
  </section>
);
