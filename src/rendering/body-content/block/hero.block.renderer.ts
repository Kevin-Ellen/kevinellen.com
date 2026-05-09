// src/rendering/body-content/block/hero.body-content.renderer.ts

import type { AppRenderContextHeroBlock } from "@shared-types/page-content/block/hero/app-render-context.hero.block.types";
import type {
  AppRenderContextPhotoMetaGroup,
  AppRenderContextPhotoMetaItem,
} from "@shared-types/media/photo/app-render-context.photo.types";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

const renderPhotoMetaTerm = (item: AppRenderContextPhotoMetaItem): string => {
  if (!item.description) {
    return escapeHtml(item.label);
  }

  return `<abbr title="${escapeAttribute(item.description)}">${escapeHtml(
    item.label,
  )}</abbr>`;
};

const renderPhotoMetaDetail = (item: AppRenderContextPhotoMetaItem): string => {
  if (!item.datetime) {
    return escapeHtml(item.value);
  }

  return `<time datetime="${escapeAttribute(item.datetime)}">${escapeHtml(
    item.value,
  )}</time>`;
};

const renderPhotoMetaItem = (item: AppRenderContextPhotoMetaItem): string =>
  `<div class="m-photo__meta-item">
    <dt class="m-photo__meta-term">${renderPhotoMetaTerm(item)}</dt>
    <dd class="m-photo__meta-detail">${renderPhotoMetaDetail(item)}</dd>
  </div>`;

const renderPhotoMetaGroup = (group: AppRenderContextPhotoMetaGroup): string =>
  `<dl class="m-photo__meta${
    group.kind === "settings" ? " m-photo__meta--settings" : ""
  }">
    ${group.items.map(renderPhotoMetaItem).join("")}
  </dl>`;

const renderPhotoMeta = (
  meta: readonly AppRenderContextPhotoMetaGroup[],
): string => {
  if (meta.length === 0) {
    return "";
  }

  return `<div class="m-photo__meta-group">
    ${meta.map(renderPhotoMetaGroup).join("")}
  </div>`;
};

export const renderHeroBlock = (module: AppRenderContextHeroBlock): string => {
  const immersiveClass = module.immersive ? " m-photo--immersive" : "";

  return `<figure class="m-contentBlock m-photo ${renderBlockFlowClass(
    module.flow,
  )}${immersiveClass}" data-photo-id="${escapeAttribute(module.photo.id)}">
    <img
      class="m-photo__object"
      src="${escapeAttribute(module.photo.src)}"
      srcset="${escapeAttribute(module.photo.srcset.join(", "))}"
      sizes="${escapeAttribute(module.photo.sizes)}"
      width="${module.photo.width}"
      height="${module.photo.height}"
      alt="${escapeAttribute(module.photo.alt)}"
      loading="${module.immersive ? "eager" : "lazy"}"
      decoding="async"
    />
    <figcaption class="m-photo__annotation">
      <p class="m-photo__caption">${escapeHtml(module.photo.commentary)}</p>
      ${renderPhotoMeta(module.photo.meta)}
    </figcaption>
  </figure>`;
};
