// src/app/life-cycle/app-render/document/page/body/modules/hero/hero.module.body.page.document.app-render.tsx

import type { HeroModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/hero/hero.module.content.page.document.app-render-context.type";

import { Svg } from "../../../../../primitives/svg/svg.primitive.app-render";

type Props = Readonly<{
  module: HeroModuleContentAppRenderContext;
}>;

export const HeroModule = ({ module }: Props) => (
  <header className="m-hero">
    <picture className="m-hero__media">
      {module.media.sources.map((source) => (
        <source
          key={source.src}
          media={source.media}
          srcSet={source.src}
          width={source.width}
          height={source.height}
        />
      ))}

      <img
        className="m-hero__image"
        src={module.media.src}
        width={module.media.width}
        height={module.media.height}
        alt={module.media.alt}
        fetchPriority={module.media.fetchPriority}
      />
    </picture>

    <div className="m-hero__content">
      <div className="l-frame">
        <p className="m-hero__eyebrow">{module.eyebrow}</p>

        <h1 className="m-hero__title">
          {module.title.map((line, index) => (
            <span key={index}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>

        <p className="m-hero__description">{module.description}</p>
      </div>
    </div>

    {module.location && (
      <div className="m-hero__location l-frame">
        <div className="c-photo-location">
          {module.location.icon && (
            <Svg
              svg={module.location.icon}
              className="c-photo-location__icon"
            />
          )}

          <span className="c-photo-location__label">
            {module.location.label}
          </span>
        </div>
      </div>
    )}
  </header>
);
