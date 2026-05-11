// src/rendering/body-content/block/section-links/section-links.block.renderer.ts

import type { AppRenderContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.types";

import { renderHeading } from "@rendering/shared/heading.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderSectionLinksIcon = (
  icon: AppRenderContextSectionLinksBlock["sections"][number]["icon"],
): string => {
  if (icon === null) {
    return "";
  }

  return [
    `<svg class="m-section-links__icon"`,
    ` width="${icon.width}"`,
    ` height="${icon.height}"`,
    ` aria-hidden="true"`,
    ` focusable="false">`,
    `<use href="#${escapeAttribute(icon.id)}"></use>`,
    `</svg>`,
  ].join("");
};

const renderSectionLinksItem = (
  section: AppRenderContextSectionLinksBlock["sections"][number],
): string =>
  [
    `<article class="m-section-links__item">`,
    `<a class="m-section-links__link" href="${escapeAttribute(section.link.href)}">`,
    renderSectionLinksIcon(section.icon),
    `<div class="m-section-links__content">`,
    renderHeading(section.heading, {
      className: "m-section-links__heading",
    }),
    section.intro
      ? `<p class="m-section-links__text">${escapeHtml(section.intro)}</p>`
      : "",
    `<p class="m-section-links__action">${escapeHtml(section.link.text)}</p>`,
    `</div>`,
    `</a>`,
    `</article>`,
  ].join("");

export const renderSectionLinksBlock = (
  module: AppRenderContextSectionLinksBlock,
): string =>
  [
    `<section class="m-section-links l-content">`,
    `<div class="m-section-links__grid">`,
    module.sections.map(renderSectionLinksItem).join(""),
    `</div>`,
    `</section>`,
  ].join("");
