// src/rendering/body-content/block/homepage-hero.body-content.renderer.ts

import type { AppRenderContextHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.page-content.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline-content.body-content.renderer";
import { renderTextLink } from "@rendering/shared/link.shared.renderer";
import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";
import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";

export const renderHomepageHeroContentModule = (
  module: AppRenderContextHomepageHeroBlockContentModule,
): string => {
  const intro = renderInlineContent(module.intro);
  const primaryLink = module.primaryLink
    ? renderTextLink({
        ...module.primaryLink,
        className: "m-homepage-hero__action",
      })
    : "";

  return `
<section class="m-homepage-hero ${getBlockFlowClass(module.flow)}">
  <div class="m-homepage-hero__media">
    <img
      class="m-homepage-hero__image"
      src="${escapeHtml(module.photo.src)}"
      srcset="${escapeHtml(module.photo.srcset.join(", "))}"
      sizes="${escapeHtml(module.photo.sizes)}"
      alt="${escapeHtml(module.photo.alt)}"
      width="${module.photo.width}"
      height="${module.photo.height}"
      loading="eager"
      decoding="async"
      fetchpriority="high"
    >
  </div>

  <div class="m-homepage-hero__content m-heading">
    ${
      module.eyebrow
        ? `<p class="m-homepage-hero__eyebrow m-heading__eyebrow">${escapeHtml(module.eyebrow)}</p>`
        : ""
    }
    <h1 class="m-homepage-hero__title m-heading__title">${escapeHtml(module.title)}</h1>
    ${intro ? `<p class="m-homepage-hero__intro m-heading__intro">${intro}</p>` : ""}
    ${primaryLink}
  </div>
</section>`;
};
