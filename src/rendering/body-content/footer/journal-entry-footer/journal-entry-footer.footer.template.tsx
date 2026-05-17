// src/rendering/body-content/footer/journal-entry-footer/journal-entry-footer.footer.template.tsx

import type { AppRenderContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.types";

type JournalEntryFooterTemplateProps = Readonly<{
  footer: AppRenderContextJournalEntryFooter;
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

const EquipmentItemTemplate = ({
  label,
  values,
}: {
  label: string;
  values: readonly string[];
}) => {
  if (values.length === 0) {
    return null;
  }

  return <DefinitionItemTemplate label={label} value={values.join(", ")} />;
};

export const JournalEntryFooterTemplate = ({
  footer,
}: JournalEntryFooterTemplateProps) => (
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
      <h3 className="m-article-footer__heading">Field notes</h3>

      <dl className="m-article-footer__list">
        <EquipmentItemTemplate
          label="Camera"
          values={footer.equipment.cameras}
        />

        <EquipmentItemTemplate label="Lens" values={footer.equipment.lenses} />
      </dl>
    </section>
  </>
);
