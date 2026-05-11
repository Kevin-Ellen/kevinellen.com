// src/rendering/body-content/block/image-strip/image-strip.block.renderer.ts

import type { AppRenderContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types";

import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";
import { renderHeading } from "@rendering/shared/heading.shared.renderer";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

const renderImageStripImage = (
  photo: AppRenderContextImageStripBlock["photos"][number],
): string =>
  [
    `<img`,
    ` class="m-image-strip__image"`,
    ` src="${escapeAttribute(photo.src)}"`,
    ` srcset="${escapeAttribute(photo.srcset.join(", "))}"`,
    ` sizes="${escapeAttribute(photo.sizes)}"`,
    ` alt="${escapeAttribute(photo.alt)}"`,
    ` width="${photo.width}"`,
    ` height="${photo.height}"`,
    ` loading="lazy"`,
    ` decoding="async"`,
    `>`,
  ].join("");

export const renderImageStripBlock = (
  module: AppRenderContextImageStripBlock,
): string => {
  return [
    `<section class="m-image-strip ${renderBlockFlowClass(module.flow)}">`,
    renderHeading(module.heading, {
      className: "m-image-strip__heading",
    }),
    `<div class="m-image-strip__inner">`,
    module.photos.map(renderImageStripImage).join(""),
    `</div>`,
    `</section>`,
  ].join("");
};
