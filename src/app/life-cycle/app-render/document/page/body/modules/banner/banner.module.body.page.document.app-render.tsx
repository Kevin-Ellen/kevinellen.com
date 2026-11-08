// src/app/life-cycle/app-render/document/page/body/modules/banner/banner.module.body.page.document.app-render.tsx

import type { BannerModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/banner/banner.module.content.page.document.app-render-context.type";

import { ContentComponent } from "../../components/component.body.page.document.app-render";

type Props = Readonly<{
  module: BannerModuleContentAppRenderContext;
}>;

export const BannerModule = ({ module }: Props) => (
  <section className="m-banner" aria-labelledby={module.heading.id}>
    <picture className="m-banner__media">
      <img
        className="m-banner__image"
        src={module.media.src}
        width={module.media.width}
        height={module.media.height}
        alt={module.media.alt}
        loading={module.media.priority ? "eager" : "lazy"}
        fetchPriority={module.media.priority ? "high" : undefined}
        decoding="async"
      />
    </picture>

    <div className="m-banner__content l-frame">
      <h2 className="m-banner__title" id={module.heading.id}>
        {module.heading.text}
      </h2>

      {module.components.map((component, index) => (
        <ContentComponent
          key={index}
          component={component}
          className="m-banner__description"
        />
      ))}
    </div>
  </section>
);
