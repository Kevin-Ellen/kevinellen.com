// src/app/rendering/content/modules/hero/hero.render.module.ts

import type { RenderContextHeroModule } from "@app/renderContext/content/modules/hero/hero.module.renderContext.types";

import {
  escapeAttribute,
  escapeHtmlContent,
} from "@app/rendering/utils/escapeContent.util";

const renderMeta = (meta: RenderContextHeroModule["meta"]): string => {
  if (meta.length === 0) {
    return "";
  }

  return `
    <dl class="m-photo__meta">
      ${meta
        .map(
          (item) => `
        <div class="m-photo__meta-item">
          <dt class="m-photo__meta-term">
            ${escapeHtmlContent(item.label)}
          </dt>
          <dd class="m-photo__meta-detail">
            ${escapeHtmlContent(item.value)}
          </dd>
        </div>
      `,
        )
        .join("")}
    </dl>
  `;
};

const renderSettings = (
  settings: RenderContextHeroModule["settings"],
): string => {
  if (settings.length === 0) {
    return "";
  }

  return `
    <dl class="m-photo__meta m-photo__meta--settings">
      ${settings
        .map((item) => {
          const titleAttr = item.description
            ? ` title="${escapeAttribute(item.description)}"`
            : "";

          return `
        <div class="m-photo__meta-item">
          <dt class="m-photo__meta-term"${titleAttr}>
            ${escapeHtmlContent(item.label)}
          </dt>
          <dd class="m-photo__meta-detail">
            ${escapeHtmlContent(item.shortValue)}
          </dd>
        </div>
      `;
        })
        .join("")}
    </dl>
  `;
};

const renderMetaGroup = (module: RenderContextHeroModule): string => {
  const meta = renderMeta(module.meta);
  const settings = renderSettings(module.settings);

  if (!meta && !settings) {
    return "";
  }

  return `
    <div class="m-photo__meta-group">
      ${meta}
      ${settings}
    </div>
  `;
};

export const renderHeroModule = (module: RenderContextHeroModule): string => {
  const modifier = module.immersive ? " m-photo--immersive" : "";

  const srcSetAttr = module.image.srcset
    ? ` srcset="${escapeAttribute(module.image.srcset)}"`
    : "";

  const sizesAttr = module.image.sizes
    ? ` sizes="${escapeAttribute(module.image.sizes)}"`
    : "";

  return `
    <figure class="m-photo${modifier}">
      <img
        class="m-photo__object"
        src="${escapeAttribute(module.image.src)}"${srcSetAttr}${sizesAttr}
        alt="${escapeAttribute(module.image.alt)}"
        width="${module.image.width}"
        height="${module.image.height}"
        loading="eager"
        decoding="async"
        fetchpriority=high
      />

      <figcaption class="m-photo__annotation">
        <p class="m-photo__caption">
          ${escapeHtmlContent(module.caption)}
        </p>

        ${renderMetaGroup(module)}
      </figcaption>
    </figure>
  `;
};
