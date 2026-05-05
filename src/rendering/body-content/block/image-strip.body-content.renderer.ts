// src/rendering/body-content/block/image-strip.body-content.renderer.ts

import type { AppRenderContextImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";
import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";
import { renderHeading } from "@rendering/shared/heading.body-content.renderer";

export const renderImageStripBlockContentModule = (
  module: AppRenderContextImageStripBlockContentModule,
): string => {
  const images = module.photos
    .map(
      (photo) => `
      <img
        class="m-image-strip__image"
        src="${photo.src}"
        srcset="${escapeHtml(photo.srcset.join(", "))}"
        sizes="${photo.sizes}"
        alt="${escapeHtml(photo.alt)}"
        width="${photo.width}"
        height="${photo.height}"
        loading="lazy"
        decoding="async"
      />
    `,
    )
    .join("");

  return `
<section class="m-image-strip ${getBlockFlowClass(module.flow)}">
${renderHeading(module.heading, {
  className: "m-image-strip__heading",
})}
  <div class="m-image-strip__inner">
    ${images}
  </div>
</section>
`;
};
