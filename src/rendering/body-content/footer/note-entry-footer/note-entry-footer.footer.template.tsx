// src/rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.template.tsx

import type { AppRenderContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-render-context.note-entry-footer.types";

type NoteEntryFooterTemplateProps = Readonly<{
  footer: AppRenderContextNoteEntryFooter;
}>;

type DefinitionItemTemplateProps = Readonly<{
  label: string;
  value: string;
}>;

const DefinitionItemTemplate = ({
  label,
  value,
}: DefinitionItemTemplateProps) => (
  <div className="m-article-footer__item">
    <dt className="m-article-footer__label">{label}</dt>
    <dd className="m-article-footer__value">{value}</dd>
  </div>
);

export const NoteEntryFooterTemplate = ({
  footer,
}: NoteEntryFooterTemplateProps) => (
  <>
    <section className="m-article-footer__group">
      <h3 className="m-article-footer__heading">Publication</h3>

      <dl className="m-article-footer__list">
        <DefinitionItemTemplate
          label="Written by"
          value={footer.publication.author}
        />
        <DefinitionItemTemplate
          label="Published"
          value={footer.publication.publishedAt}
        />
        <DefinitionItemTemplate
          label="Last updated"
          value={footer.publication.updatedAt}
        />
      </dl>
    </section>

    <section className="m-article-footer__group">
      <h3 className="m-article-footer__heading">Note details</h3>

      <dl className="m-article-footer__list">
        <DefinitionItemTemplate label="Topic" value={footer.topic} />
      </dl>
    </section>
  </>
);
