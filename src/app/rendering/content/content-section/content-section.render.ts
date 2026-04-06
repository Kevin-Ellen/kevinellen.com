// src/app/rendering/content/contentSection.render.ts

import type { RenderContextContentSection } from "@app/renderContext/content/content.renderContext.types";

import { renderContentLeafModule } from "@app/rendering/content/modules/module.render";

import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

const renderHeading = (
  heading: RenderContextContentSection["heading"],
): string => {
  if (!heading) return "";

  const tag = `h${heading.level}`;
  const className = heading.visuallyHidden ? ` class="u-visually-hidden"` : "";

  return `<${tag}${className}>${escapeHtmlContent(heading.text)}</${tag}>`;
};

export const renderContentSection = (
  section: RenderContextContentSection,
): string => {
  const heading = renderHeading(section.heading);

  const modules = section.modules
    .map((module) => renderContentLeafModule(module))
    .join("");

  return `<section class="m-content-section">${heading}${modules}</section>`;
};
