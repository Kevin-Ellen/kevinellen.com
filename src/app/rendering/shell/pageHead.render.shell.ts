// src/app/rendering/shell/pageHead.render.shell.ts

import type { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { RenderContext } from "@app/renderContext/class.renderContext";
import type {
  RenderContextBreadcrumb,
  RenderContextHeaderBranding,
  RenderContextNavigationItem,
} from "@app/renderContext/renderContext.types";

import {
  escapeHtmlContent,
  escapeAttribute,
} from "@app/rendering/utils/escapeContent.util";

const renderSvgUseById = (
  id: SvgAssetId,
  className: string,
  width: number,
  height: number,
  label?: string,
): string => {
  const ariaAttribute = label
    ? ` aria-label="${escapeAttribute(label)}"`
    : ' aria-hidden="true"';

  return `<svg class="${escapeAttribute(
    className,
  )}"${ariaAttribute} width="${width}" height="${height}">
    <use href="#${escapeAttribute(id)}"></use>
  </svg>`;
};

const renderHeaderBranding = (
  branding: RenderContextHeaderBranding,
): string => {
  return `<a class="l-header__brand" href="${escapeAttribute(
    branding.href,
  )}" aria-label="${escapeAttribute(branding.ariaLabel)}">
    ${renderSvgUseById(
      branding.logo.id,
      "l-header__brand-logo",
      branding.logo.width,
      branding.logo.height,
    )}
  </a>`;
};

const renderPrimaryNavItem = (item: RenderContextNavigationItem): string => {
  const ariaCurrentAttribute = item.isCurrent ? ' aria-current="page"' : "";
  const isHome = item.kind === "page" && item.id === "home";
  const itemModifierClass = isHome ? " l-header__item--home" : "";

  const content =
    isHome && item.icon
      ? renderSvgUseById(
          item.icon.id,
          "l-header__icon",
          item.icon.width,
          item.icon.height,
          item.label,
        )
      : escapeHtmlContent(item.label);

  const ariaLabelAttribute =
    isHome && item.icon ? ` aria-label="${escapeAttribute(item.label)}"` : "";

  return `<li class="l-header__item${itemModifierClass}">
    <a class="l-header__link" href="${escapeAttribute(
      item.href,
    )}"${ariaCurrentAttribute}${ariaLabelAttribute}>
      ${content}
    </a>
  </li>`;
};

const renderPrimaryNav = (
  items: readonly RenderContextNavigationItem[],
): string => {
  return `<div class="l-header__nav">
    <ul class="l-header__list">
      ${items.map((item) => renderPrimaryNavItem(item)).join("")}
    </ul>
  </div>`;
};

const renderSocialNavItem = (item: RenderContextNavigationItem): string => {
  const content = item.icon
    ? renderSvgUseById(
        item.icon.id,
        "l-header__icon",
        item.icon.width,
        item.icon.height,
      )
    : `<span class="l-header__label">${escapeHtmlContent(item.label)}</span>`;

  return `<li class="l-header__item">
    <a class="l-header__link" href="${escapeAttribute(
      item.href,
    )}" aria-label="${escapeAttribute(item.label)}">
      ${content}
    </a>
  </li>`;
};

const renderSocialNav = (
  items: readonly RenderContextNavigationItem[],
): string => {
  if (!items.length) {
    return "";
  }

  return `<div class="l-header__social">
    <ul class="l-header__list l-header__list--social">
      ${items.map((item) => renderSocialNavItem(item)).join("")}
    </ul>
  </div>`;
};

const renderBreadcrumbs = (
  breadcrumbs: readonly RenderContextBreadcrumb[],
): string => {
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
        <a class="l-header__breadcrumb-link" href="${escapeAttribute(
          item.href,
        )}">${escapeHtmlContent(item.label)}</a>
      </li>`;
    })
    .join("");

  return `<nav class="l-header__breadcrumb" aria-label="Breadcrumb">
    <ol class="l-header__breadcrumb-list">
      ${items}
    </ol>
  </nav>`;
};

export const pageHeadRenderShell = (ctx: RenderContext): string => {
  return `<header class="l-header">
    <div class="l-page__frame">
      <div class="l-header__top">
        ${renderHeaderBranding(ctx.header.branding)}
        <nav class="l-header__primary" aria-label="Primary">
          ${renderPrimaryNav(ctx.header.navigation.primary)}
          ${renderSocialNav(ctx.header.navigation.social)}
        </nav>
      </div>
      ${renderBreadcrumbs(ctx.header.breadcrumbs)}
    </div>
  </header>
  <div class="l-header-sentinel" aria-hidden="true"></div>`;
};
