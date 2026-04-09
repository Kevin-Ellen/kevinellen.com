// src/app/renderContext/content/content.resolve.renderContext.ts

import type { AppContextPageBodyContent } from "@app/appContext/content/content.appContext.types";
import type { RenderContextPageBodyContent } from "@app/renderContext/content/content.renderContext.types";

import { resolveContentModuleRenderContext } from "@app/renderContext/content/modules/module.resolve.renderContext";
import { resolveJournalEntryFooterRenderContext } from "@app/renderContext/content/modules/journalEntryFooter/journalEntryFooter.resolve.renderContext";

export const resolveContentRenderContext = (
  content: AppContextPageBodyContent,
): RenderContextPageBodyContent => {
  return {
    head: {
      eyebrow: content.head.eyebrow,
      title: content.head.title,
      intro: content.head.intro,
    },

    sections: content.sections.map((section) => ({
      kind: section.kind,
      heading: section.heading
        ? {
            text: section.heading.text,
            visuallyHidden: section.heading.visuallyHidden,
            level: section.heading.level,
          }
        : undefined,
      modules: section.modules.map(resolveContentModuleRenderContext),
    })),

    footer: content.footer
      ? resolveJournalEntryFooterRenderContext(content.footer)
      : undefined,
  };
};
