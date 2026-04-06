// src/app/rendering/content/pageBody.render.ts

import type { RenderContext } from "@app/renderContext/class.renderContext";

import { renderContentSection } from "@app/rendering/content/content-section/content-section.render";

import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

export const renderPageBody = (ctx: RenderContext): string => {
  const { content } = ctx;

  const head = `
    <header class="m-page-intro">
      <p class="m-page-intro__eyebrow">${escapeHtmlContent(content.head.eyebrow)}</p>
      <h1 class="m-page-intro__title">${escapeHtmlContent(content.head.title)}</h1>
      <p class="m-page-intro__intro">${escapeHtmlContent(content.head.intro)}</p>
    </header>
  `;

  const sections = content.sections
    .map((section) => renderContentSection(section))
    .join("");

  return `<main class="l-content">${head}${sections}</main>`;
};
