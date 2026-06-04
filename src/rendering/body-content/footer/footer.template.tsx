// src/rendering/body-content/footer/footer.template.tsx

import { Fragment, type ReactNode } from "react";

import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

import { JournalEntryFooterTemplate } from "@rendering/body-content/footer/journal-entry-footer/journal-entry-footer.footer.template";
import { NoteEntryFooterTemplate } from "@rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.template";

type FooterRendererMap = Readonly<{
  [K in AppRenderContextPageContentFooter["kind"]]: (
    footer: Extract<AppRenderContextPageContentFooter, { kind: K }>,
  ) => ReactNode;
}>;

const footerTemplates = {
  journalEntryFooter: (footer) => (
    <JournalEntryFooterTemplate footer={footer} />
  ),

  noteEntryFooter: (footer) => <NoteEntryFooterTemplate footer={footer} />,
} satisfies FooterRendererMap;

type BodyContentFooterTemplateProps = Readonly<{
  footer: readonly AppRenderContextPageContentFooter[];
}>;

export const BodyContentFooterTemplate = ({
  footer,
}: BodyContentFooterTemplateProps) => {
  if (footer.length === 0) {
    return null;
  }

  return (
    <footer className="l-content m-article-footer">
      {footer.map((item, index) => {
        const renderer = footerTemplates[item.kind] as (
          footer: AppRenderContextPageContentFooter,
        ) => ReactNode;

        return <Fragment key={`footer:${index}`}>{renderer(item)}</Fragment>;
      })}
    </footer>
  );
};
