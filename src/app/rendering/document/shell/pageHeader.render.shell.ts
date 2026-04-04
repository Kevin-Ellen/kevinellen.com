// src/app/rendering/document/shell/pageHeader.render.shell.ts

import type {
  DocumentRenderContext,
  DocumentRenderNavigationItem,
} from "@app/rendering/document/document.render.types";

import { escapeAttribute, escapeHtmlContent } from "@utils/escapeContent.util";

const renderSvgUse = (
  item: DocumentRenderNavigationItem,
  className: string,
  label?: string,
): string => {
  if (!item.svgIcon) {
    return "";
  }

  const ariaLabelAttribute = label
    ? ` aria-label="${escapeAttribute(label)}"`
    : ' aria-hidden="true"';

  return `<svg class="${escapeAttribute(className)}"${ariaLabelAttribute} width="${item.svgIcon.width}" height="${item.svgIcon.height}">
    <use href="#${escapeAttribute(item.svgIcon.id)}"></use>
  </svg>`;
};

const renderPrimaryNavItem = (item: DocumentRenderNavigationItem): string => {
  const ariaCurrentAttribute = item.isCurrent ? ' aria-current="page"' : "";
  const isHome = item.kind === "page" && item.id === "home";
  const itemModifierClass = isHome ? " l-header__item--home" : "";

  const content =
    isHome && item.svgIcon
      ? renderSvgUse(item, "l-header__icon", item.label)
      : escapeHtmlContent(item.label);

  const ariaLabelAttribute =
    isHome && item.svgIcon
      ? ` aria-label="${escapeAttribute(item.label)}"`
      : "";

  return `<li class="l-header__item${itemModifierClass}">
    <a class="l-header__link" href="${escapeAttribute(item.href)}"${ariaCurrentAttribute}${ariaLabelAttribute}>
      ${content}
    </a>
  </li>`;
};

const renderPrimaryNav = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const items = documentRenderContext.navigation.header.primary
    .map((item) => renderPrimaryNavItem(item))
    .join("");

  return `<div class="l-header__nav">
    <ul class="l-header__list">
      ${items}
    </ul>
  </div>`;
};

const renderSocialNavItem = (item: DocumentRenderNavigationItem): string => {
  const content = item.svgIcon
    ? renderSvgUse(item, "l-header__icon")
    : `<span class="l-header__label">${escapeHtmlContent(item.label)}</span>`;

  return `<li class="l-header__item">
    <a class="l-header__link" href="${escapeAttribute(item.href)}" aria-label="${escapeAttribute(item.label)}">
      ${content}
    </a>
  </li>`;
};

const renderSocialNav = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const items = documentRenderContext.navigation.header.social
    .map((item) => renderSocialNavItem(item))
    .join("");

  if (!items) {
    return "";
  }

  return `<div class="l-header__social">
    <ul class="l-header__list l-header__list--social">
      ${items}
    </ul>
  </div>`;
};

const renderBreadcrumbs = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const { breadcrumbs } = documentRenderContext;

  if (!breadcrumbs.length) {
    return "";
  }

  const items = breadcrumbs
    .map((item, index) => {
      const isLast = index === breadcrumbs.length - 1;

      if (isLast) {
        return `<li class="l-header__breadcrumb-item" aria-current="page">
          ${escapeHtmlContent(item.label)}
        </li>`;
      }

      return `<li class="l-header__breadcrumb-item">
        <a class="l-header__breadcrumb-link" href="${escapeAttribute(item.href)}">${escapeHtmlContent(item.label)}</a>
      </li>`;
    })
    .join("");

  return `<nav class="l-header__breadcrumb" aria-label="Breadcrumb">
    <ol class="l-header__breadcrumb-list">
      ${items}
    </ol>
  </nav>`;
};

export const renderPageHeader = (
  documentRenderContext: DocumentRenderContext,
): string => {
  return `<header class="l-header">
    <div class="l-page__frame">
      <nav class="l-header__primary" aria-label="Primary">
        ${renderPrimaryNav(documentRenderContext)}
        ${renderSocialNav(documentRenderContext)}
      </nav>
      ${renderBreadcrumbs(documentRenderContext)}
    </div>
  </header>
  <div class="l-header-sentinel" aria-hidden="true"></div>`;
};
