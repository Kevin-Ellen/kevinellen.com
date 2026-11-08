// src/app/life-cycle/app-render/document/page/body/modules/topic-explorer/topic-explorer.module.body.page.document.app-render.tsx

import type { TopicExplorerModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/topic-explorer/topic-explorer.module.content.page.document.app-render-context.type";

type Props = Readonly<{
  module: TopicExplorerModuleContentAppRenderContext;
}>;

export const TopicExplorerModule = ({ module }: Props) => (
  <section
    className="m-topic-explorer l-frame"
    aria-labelledby="topic-explorer-title"
  >
    <div className="m-topic-explorer__header">
      <h2 id="topic-explorer-title" className="m-topic-explorer__title">
        {module.heading}
      </h2>

      <a href="/topics" className="c-editorial-link c-editorial-link--subtle">
        <span className="c-editorial-link__label">View all topics</span>
        <span className="c-editorial-link__arrow" aria-hidden="true">
          →
        </span>
      </a>
    </div>

    <div className="m-topic-explorer__grid">
      {module.featured.map((item) => (
        <a key={item.id} href={item.href} className="m-topic-explorer__card">
          <img
            src={item.image.src}
            alt={item.image.alt}
            loading="lazy"
            decoding="async"
          />

          <div className="m-topic-explorer__card-content">
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </div>
        </a>
      ))}
    </div>

    {module.links.length > 0 && (
      <nav className="m-topic-explorer__more" aria-label="More topics">
        <span className="m-topic-explorer__more-label">More topics</span>

        <div className="m-topic-explorer__links">
          {module.links.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    )}
  </section>
);
