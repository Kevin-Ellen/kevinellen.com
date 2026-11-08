// src/app/life-cycle/app-render/document/page/body/modules/article-footer/article-footer.module.body.page.document.app-render.tsx

import type { ArticleFooterModuleContentAppRenderContext } from "../../../../../../../types/document/page/content/modules/article-footer/article-footer.module.content.page.document.app-render-context.type";

type Props = Readonly<{
  module: ArticleFooterModuleContentAppRenderContext;
}>;

export const ArticleFooterModule = ({ module }: Props) => {
  const { publication, fieldNotes } = module;

  return (
    <footer className="m-article-footer l-reading">
      <section
        className="m-article-footer__group"
        aria-labelledby="publication-heading"
      >
        <h2 id="publication-heading" className="m-article-footer__heading">
          Publication
        </h2>

        <dl className="m-article-footer__list">
          <div className="m-article-footer__item">
            <dt>Written by</dt>
            <dd>{publication.author}</dd>
          </div>

          <div className="m-article-footer__item">
            <dt>Published</dt>
            <dd>
              <time dateTime={publication.published.iso}>
                {publication.published.label}
              </time>
            </dd>
          </div>

          {publication.lastUpdated && (
            <div className="m-article-footer__item">
              <dt>Last updated</dt>
              <dd>
                <time dateTime={publication.lastUpdated.iso}>
                  {publication.lastUpdated.label}
                </time>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section
        className="m-article-footer__group"
        aria-labelledby="field-notes-heading"
      >
        <h2 id="field-notes-heading" className="m-article-footer__heading">
          Field notes
        </h2>

        <dl className="m-article-footer__list">
          <div className="m-article-footer__item">
            <dt>Camera</dt>
            <dd>{fieldNotes.cameras.join(", ")}</dd>
          </div>

          <div className="m-article-footer__item">
            <dt>Lens</dt>
            <dd>{fieldNotes.lenses.join(", ")}</dd>
          </div>
        </dl>
      </section>
    </footer>
  );
};
