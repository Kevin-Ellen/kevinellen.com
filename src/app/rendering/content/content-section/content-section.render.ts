// src/app/rendering/content/contentSection.render.ts

import type { RenderContextContentSection } from "@app/renderContext/content/content.renderContext.types";

import { renderContentLeafModule } from "@app/rendering/content/modules/module.render";

import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

const renderHeading = (
  heading: RenderContextContentSection["heading"],
): string => {
  if (!heading) return "";

  const tag = `h${heading.level}`;
  const className = heading.visuallyHidden ? ` class="u-sr-only"` : "";

  return `<${tag}${className}>${escapeHtmlContent(heading.text)}</${tag}>`;
};

export const renderContentSection = (
  section: RenderContextContentSection,
): string => {
  const heading = renderHeading(section.heading);

  const modules = section.modules
    .map((module) => renderContentLeafModule(module))
    .join("");

  if (!section.heading && section.modules.length === 1) {
    return modules;
  }
  return `<section>${heading}${modules}</section>`;
};
