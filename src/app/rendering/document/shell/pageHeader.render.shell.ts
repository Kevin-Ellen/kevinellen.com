// src/app/rendering/document/shell/pageHeader.render.shell.ts

import type {
  DocumentRenderContext,
  DocumentRenderNavigationItem,
} from "@app/rendering/document/document.render.types";

import { escapeAttribute, escapeHtmlContent } from "@utils/escapeContent.util";

const renderSvgUseById = (
  svgId: string,
  className: string,
  label?: string,
): string => {
  const ariaLabelAttribute = label
    ? ` aria-label="${escapeAttribute(label)}"`
    : ' aria-hidden="true"';

  return `<svg class="${escapeAttribute(className)}"${ariaLabelAttribute}>
    <use href="#${escapeAttribute(svgId)}"></use>
  </svg>`;
};

const renderHeaderBranding = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const { branding } = documentRenderContext.pageHeader;

  return `<a class="l-header__brand" href="${escapeAttribute(branding.href)}" aria-label="${escapeAttribute(branding.ariaLabel)}">
    <svg class="${escapeAttribute(branding.logo.className)}" aria-hidden="true" width="${branding.logo.width}" height="${branding.logo.height}">
      <use href="#${escapeAttribute(branding.logo.id)}"></use>
    </svg>
  </a>`;
};

const renderPrimaryNavItem = (item: DocumentRenderNavigationItem): string => {
  const ariaCurrentAttribute = item.isCurrent ? ' aria-current="page"' : "";
  const isHome = item.kind === "page" && item.id === "home";
  const itemModifierClass = isHome ? " l-header__item--home" : "";

  const content =
    isHome && item.svgId
      ? renderSvgUseById(item.svgId, "l-header__icon", item.label)
      : escapeHtmlContent(item.label);

  const ariaLabelAttribute =
    isHome && item.svgId ? ` aria-label="${escapeAttribute(item.label)}"` : "";

  return `<li class="l-header__item${itemModifierClass}">
    <a class="l-header__link" href="${escapeAttribute(item.href)}"${ariaCurrentAttribute}${ariaLabelAttribute}>
      ${content}
    </a>
  </li>`;
};

const renderPrimaryNav = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const items = documentRenderContext.pageHeader.navigation.primary
    .map((item) => renderPrimaryNavItem(item))
    .join("");

  return `<div class="l-header__nav">
    <ul class="l-header__list">
      ${items}
    </ul>
  </div>`;
};

const renderSocialNavItem = (item: DocumentRenderNavigationItem): string => {
  const content = item.svgId
    ? renderSvgUseById(item.svgId, "l-header__icon")
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
  const items = documentRenderContext.pageHeader.navigation.social
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
  const { breadcrumbs } = documentRenderContext.pageHeader;

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
      <div class="l-header__top">
        ${renderHeaderBranding(documentRenderContext)}
        <nav class="l-header__primary" aria-label="Primary">
          ${renderPrimaryNav(documentRenderContext)}
          ${renderSocialNav(documentRenderContext)}
        </nav>
      </div>
      ${renderBreadcrumbs(documentRenderContext)}
    </div>
  </header>
  <div class="l-header-sentinel" aria-hidden="true"></div>`;
};
