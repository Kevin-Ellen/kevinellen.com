// src/app/rendering/content/contentSection.render.ts

import type { RenderContextContentSection } from "@app/renderContext/content/content.renderContext.types";

import { renderContentLeafModule } from "@app/rendering/content/modules/module.render";
import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

type RenderedSectionItem = {
  flow: "content" | "breakout";
  html: string;
};

const renderHeading = (
  heading: RenderContextContentSection["heading"],
): string => {
  if (!heading) return "";

  const tag = `h${heading.level}`;
  const className = heading.visuallyHidden ? ` class="u-sr-only"` : "";

  return `<${tag}${className}>${escapeHtmlContent(heading.text)}</${tag}>`;
};

const renderContentWrapper = (items: readonly string[]): string => {
  return `<div class="l-content">${items.join("")}</div>`;
};

const renderSectionItems = (
  section: RenderContextContentSection,
): readonly RenderedSectionItem[] => {
  const items: RenderedSectionItem[] = [];

  if (section.heading) {
    items.push({
      flow: "content",
      html: renderHeading(section.heading),
    });
  }

  for (const module of section.modules) {
    items.push({
      flow: module.flow,
      html: renderContentLeafModule(module),
    });
  }

  return items;
};

export const renderContentSection = (
  section: RenderContextContentSection,
): string => {
  const items = renderSectionItems(section);

  if (items.length === 1 && !section.heading) {
    return items[0].html;
  }

  const renderedParts: string[] = [];
  let contentBuffer: string[] = [];

  const flushContentBuffer = (): void => {
    if (contentBuffer.length === 0) {
      return;
    }

    renderedParts.push(renderContentWrapper(contentBuffer));
    contentBuffer = [];
  };

  for (const item of items) {
    if (item.flow === "content") {
      contentBuffer.push(item.html);
      continue;
    }

    flushContentBuffer();
    renderedParts.push(item.html);
  }

  flushContentBuffer();

  return `<section>${renderedParts.join("")}</section>`;
};
