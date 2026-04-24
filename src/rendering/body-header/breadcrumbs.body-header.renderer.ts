// src/rendering/body-header/breadcrumbs.body-header.renderer.ts

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { AppRenderContextBreadcrumbs } from "@shared-types/breadcrumbs/app-render-context.breadcrumbs.types";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderBreadcrumbItem = (item: AppRenderContextLink): string => {
  return `<li class="l-header__breadcrumb-item">
    <a class="l-header__breadcrumb-link" href="${escapeAttribute(item.href)}">
      ${escapeHtml(item.text)}
    </a>
  </li>`;
};

export const renderBodyHeaderBreadcrumbs = (
  breadcrumbs: AppRenderContextBreadcrumbs,
): string => {
  return `<nav class="l-header__breadcrumb" aria-label="Breadcrumb">
    <ol class="l-header__breadcrumb-list">
      ${breadcrumbs.items.map(renderBreadcrumbItem).join("")}
      <li class="l-header__breadcrumb-item" aria-current="page">
        ${escapeHtml(breadcrumbs.current)}
      </li>
    </ol>
  </nav>`;
};
