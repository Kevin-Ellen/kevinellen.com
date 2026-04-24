// src/rendering/body-header/navigation.body-header.renderer.ts

import type { AppRenderContextBodyHeaderNavigation } from "@app-render-context/types/body-header.app-render-context.types";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

type AppRenderContextBodyHeaderNavigationLink =
  AppRenderContextBodyHeaderNavigation["primary"][number];

const renderLinkAttributes = (
  link: AppRenderContextBodyHeaderNavigationLink,
): string => {
  const attributes = [
    `href="${escapeAttribute(link.href)}"`,
    link.openInNewTab ? `target="_blank"` : "",
    link.openInNewTab ? `rel="noopener noreferrer"` : "",
    link.ariaCurrent
      ? `aria-current="${escapeAttribute(link.ariaCurrent)}"`
      : "",
    !link.svg && link.text
      ? ""
      : link.text
        ? `aria-label="${escapeAttribute(link.text)}"`
        : "",
  ]
    .filter(Boolean)
    .join(" ");

  return attributes;
};

const renderPrimaryLink = (
  link: AppRenderContextBodyHeaderNavigationLink,
): string => {
  return `<li class="l-header__item">
    <a class="l-header__link" ${renderLinkAttributes(link)}>
      ${escapeHtml(link.text)}
    </a>
  </li>`;
};

const renderSocialLink = (
  link: AppRenderContextBodyHeaderNavigationLink,
): string => {
  if (!link.svg) {
    return `<li class="l-header__item">
      <a class="l-header__link" ${renderLinkAttributes(link)}>
        ${escapeHtml(link.text)}
      </a>
    </li>`;
  }

  return `<li class="l-header__item">
    <a class="l-header__link" ${renderLinkAttributes(link)}>
      <svg class="l-header__icon" aria-hidden="true" width="${link.svg.width}" height="${link.svg.height}">
        <use href="#${escapeAttribute(link.svg.id)}"></use>
      </svg>
    </a>
  </li>`;
};

const renderPrimaryNavigation = (
  links: AppRenderContextBodyHeaderNavigation["primary"],
): string => {
  return `<div class="l-header__nav">
    <ul class="l-header__list">
      ${links.map(renderPrimaryLink).join("")}
    </ul>
  </div>`;
};

const renderSocialNavigation = (
  links: AppRenderContextBodyHeaderNavigation["social"],
): string => {
  return `<div class="l-header__social">
    <ul class="l-header__list l-header__list--social">
      ${links.map(renderSocialLink).join("")}
    </ul>
  </div>`;
};

export const renderBodyHeaderNavigation = (
  navigation: AppRenderContextBodyHeaderNavigation,
): string => {
  return `<nav class="l-header__primary" aria-label="Primary">
    ${renderPrimaryNavigation(navigation.primary)}
    ${renderSocialNavigation(navigation.social)}
  </nav>`;
};
