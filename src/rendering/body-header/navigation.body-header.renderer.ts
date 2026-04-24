// src/rendering/body-header/navigation.body-header.renderer.ts

import type { AppRenderContextBodyHeaderNavigation } from "@app-render-context/types/body-header.app-render-context.types";

import {
  renderLinkAttributes,
  renderTextLink,
} from "@rendering/shared/link.shared.renderer";
import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";

type AppRenderContextBodyHeaderNavigationLink =
  AppRenderContextBodyHeaderNavigation["primary"][number];

const renderPrimaryLink = (
  link: AppRenderContextBodyHeaderNavigationLink,
): string => {
  return `<li class="l-header__item">
    ${renderTextLink({
      ...link,
      className: "l-header__link",
    })}
  </li>`;
};

const renderSocialLink = (
  link: AppRenderContextBodyHeaderNavigationLink,
): string => {
  if (!link.svg) {
    return `<li class="l-header__item">
      ${renderTextLink({
        ...link,
        className: "l-header__link",
      })}
    </li>`;
  }

  return `<li class="l-header__item">
    <a ${renderLinkAttributes({
      ...link,
      className: "l-header__link",
      ariaLabel: link.text,
    })}>
      ${renderSvgReference(link.svg, "l-header__icon")}
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
