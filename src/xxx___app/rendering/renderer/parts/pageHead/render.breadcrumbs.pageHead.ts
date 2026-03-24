// src/app/rendering/renderer/parts/pageHead/render.breadcrumbs.pageHead.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";
import { escapeHtml } from "@app/rendering/renderer/utils/escapeHtml.util.renderer";

export const renderBreadcrumbs = (ctx: DocumentRenderContext): string => {
  const breadcrumbs = ctx.pageHead.breadcrumbs;

  if (!breadcrumbs.length) {
    return "";
  }

  const items = breadcrumbs
    .map((item, index) => {
      const isLast = index === breadcrumbs.length - 1;

      if (isLast) {
        return `<li class="l-header__breadcrumb-item" aria-current="page">
          ${escapeHtml(item.label)}
        </li>`;
      }

      return `<li class="l-header__breadcrumb-item">
        <a class="l-header__breadcrumb-link" href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a>
      </li>`;
    })
    .join("");

  return `<nav class="l-header__breadcrumb" aria-label="Breadcrumb">
    <ol class="l-header__breadcrumb-list">
      ${items}
    </ol>
  </nav>`;
};
