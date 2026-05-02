// src/rendering/body-content/footer/footer.body-content.renderer.ts

import type { AppRenderContextPageFooterModule } from "@shared-types/page-content/app-render-context.page-content.types";

import { renderJournalEntryFooterModule } from "@rendering/body-content/footer/journal-entry-footer.body-content.renderer";

type AppRenderContextFooterRendererMap = Readonly<{
  [K in AppRenderContextPageFooterModule["kind"]]: (
    module: Extract<AppRenderContextPageFooterModule, { kind: K }>,
  ) => string;
}>;

const footerContentModuleRenderers = {
  journalEntryFooter: renderJournalEntryFooterModule,
} satisfies AppRenderContextFooterRendererMap;

export const renderBodyContentFooter = (
  footer: readonly AppRenderContextPageFooterModule[],
): string => {
  if (footer.length === 0) {
    return "";
  }

  const modules = footer
    .map((module) => {
      const renderer = footerContentModuleRenderers[module.kind] as (
        module: AppRenderContextPageFooterModule,
      ) => string;

      return renderer(module);
    })
    .join("");

  return `<footer class="l-content m-article-footer">${modules}</footer>`;
};
