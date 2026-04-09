// src/app/rendering/content/pageBody.render.ts

import type { RenderContext } from "@app/renderContext/class.renderContext";

import { renderContentSection } from "@app/rendering/content/content-section/content-section.render";
import { renderJournalEntryFooter } from "@app/rendering/content/modules/journalEntryFooter/journalEntryFooter.render.module";

import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

export const renderPageBody = (ctx: RenderContext): string => {
  const { content } = ctx;

  const head = `
    <header class="l-content m-heading">
      <p class="m-heading__eyebrow">${escapeHtmlContent(content.head.eyebrow)}</p>
      <h1 class="m-heading__title">${escapeHtmlContent(content.head.title)}</h1>
      <p class="m-heading__intro">${escapeHtmlContent(content.head.intro)}</p>
    </header>
  `;

  const sections = content.sections
    .map((section) => renderContentSection(section))
    .join("");

  const footer = content.footer ? renderJournalEntryFooter(content.footer) : "";

  return `<main class="l-frame">${head}${sections}${footer}</main>`;
};
