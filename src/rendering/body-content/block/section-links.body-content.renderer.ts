// src/rendering/body-content/block/section-links.body-content.renderer.ts

import type { AppRenderContextSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.page-content.types";

import { renderHeading } from "@rendering/shared/heading.body-content.renderer";
import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

const renderIcon = (
  icon: AppRenderContextSectionLinksBlockContentModule["sections"][number]["icon"],
): string => {
  if (icon === null) {
    return "";
  }

  return `
    <svg
      class="m-section-links__icon"
      width="${icon.width}"
      height="${icon.height}"
      aria-hidden="true"
      focusable="false"
    >
      <use href="#${escapeHtml(icon.id)}"></use>
    </svg>
  `;
};

export const renderSectionLinksBlockContentModule = (
  module: AppRenderContextSectionLinksBlockContentModule,
): string => {
  const sections = module.sections
    .map(
      (section) => `
        <article class="m-section-links__item">
          <a
            class="m-section-links__link"
            href="${escapeHtml(section.link.href)}"
          >
            ${renderIcon(section.icon)}

            <div class="m-section-links__content">
              ${renderHeading(section.heading, {
                className: "m-section-links__heading",
              })}

              ${
                section.intro
                  ? `
                    <p class="m-section-links__text">
                      ${escapeHtml(section.intro)}
                    </p>
                  `
                  : ""
              }

              <p class="m-section-links__action">
                ${escapeHtml(section.link.text)}
              </p>
            </div>
          </a>
        </article>
      `,
    )
    .join("");

  return `
<section class="m-section-links l-content">
  <div class="m-section-links__grid">
    ${sections}
  </div>
</section>
`;
};
