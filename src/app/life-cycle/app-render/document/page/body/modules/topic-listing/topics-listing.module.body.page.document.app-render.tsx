// src/app/life-cycle/app-render/document/page/body/modules/topic-listing/topics-listing.module.body.page.document.app-render.tsx

import type { TopicListingModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/topic-listing/topic-listing.module.page.document.content.app-render-context.type";

import { PaginationComponent } from "../../components/pagination/pagination.component.body.page.document.app-render";

type Props = Readonly<{
  module: TopicListingModuleContentAppRenderContext;
}>;

export const TopicsListingModule = ({ module }: Props) => (
  <section className="m-topic-listing l-frame" aria-labelledby="topics-heading">
    <h2 id="topics-heading" className="m-topic-listing__heading">
      {module.heading}
    </h2>

    <div className="m-topic-listing__grid">
      {module.items.map((item) => {
        const titleId = `topic-${item.id}`;

        return (
          <article key={item.id} className="m-topic-listing__item">
            <a
              className="m-topic-listing__link"
              href={item.href}
              aria-labelledby={titleId}
            >
              <img
                className="m-topic-listing__image"
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                loading="lazy"
                decoding="async"
              />

              <div className="m-topic-listing__content">
                <h3 className="m-topic-listing__title" id={titleId}>
                  {item.label}
                </h3>

                <p className="m-topic-listing__description">
                  {item.description}
                </p>

                <span
                  className="c-editorial-link c-editorial-link--subtle"
                  aria-hidden="true"
                >
                  <span className="c-editorial-link__label">Explore topic</span>
                  <span className="c-editorial-link__arrow">→</span>
                </span>
              </div>
            </a>
          </article>
        );
      })}
    </div>
    {module.pagination && (
      <PaginationComponent
        pagination={module.pagination}
        label="Topics pagination"
      />
    )}
  </section>
);
