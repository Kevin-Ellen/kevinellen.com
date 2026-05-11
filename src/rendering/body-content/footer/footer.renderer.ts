// src/rendering/body-content/footer/footer.renderer.ts

// src/rendering/body-content/footer/footer.renderer.ts

import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

import { renderJournalEntryFooter } from "@rendering/body-content/footer/journal-entry-footer/journal-entry-footer.footer.renderer";
import { renderNoteEntryFooter } from "@rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.renderer";

type AppRenderContextFooterRendererMap = Readonly<{
  [K in AppRenderContextPageContentFooter["kind"]]: (
    module: Extract<AppRenderContextPageContentFooter, { kind: K }>,
  ) => string;
}>;

const footerContentModuleRenderers = {
  journalEntryFooter: renderJournalEntryFooter,
  noteEntryFooter: renderNoteEntryFooter,
} satisfies AppRenderContextFooterRendererMap;

export const renderBodyContentFooter = (
  footer: readonly AppRenderContextPageContentFooter[],
): string => {
  if (footer.length === 0) {
    return "";
  }

  const modules = footer
    .map((module) => {
      const renderer = footerContentModuleRenderers[module.kind] as (
        module: AppRenderContextPageContentFooter,
      ) => string;

      return renderer(module);
    })
    .join("");

  return `<footer class="l-content m-article-footer">${modules}</footer>`;
};
