// src/rendering/body-content/block/homepage-hero/homepage-hero.block.renderer.ts

import type { AppRenderContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";
import { renderTextLink } from "@rendering/shared/link.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

export const renderHomepageHeroBlock = (
  module: AppRenderContextHomepageHeroBlock,
): string => {
  const intro = renderInlineContent(module.intro);

  const primaryLink = module.primaryLink
    ? renderTextLink({
        ...module.primaryLink,
        className: "m-homepage-hero__action",
      })
    : "";

  return [
    `<section class="m-homepage-hero ${renderBlockFlowClass(module.flow)}">`,

    `<div class="m-homepage-hero__media">`,
    `<img
      class="m-homepage-hero__image"
      src="${escapeAttribute(module.photo.src)}"
      srcset="${escapeAttribute(module.photo.srcset.join(", "))}"
      sizes="${escapeAttribute(module.photo.sizes)}"
      alt="${escapeAttribute(module.photo.alt)}"
      width="${module.photo.width}"
      height="${module.photo.height}"
      loading="eager"
      decoding="async"
      fetchpriority="high"
    >`,
    `</div>`,

    `<div class="m-homepage-hero__content m-heading">`,

    module.eyebrow
      ? `<p class="m-homepage-hero__eyebrow m-heading__eyebrow">${escapeHtml(module.eyebrow)}</p>`
      : "",

    `<h1 class="m-homepage-hero__title m-heading__title">${escapeHtml(module.title)}</h1>`,

    intro
      ? `<p class="m-homepage-hero__intro m-heading__intro">${intro}</p>`
      : "",

    primaryLink,

    `</div>`,
    `</section>`,
  ].join("");
};
