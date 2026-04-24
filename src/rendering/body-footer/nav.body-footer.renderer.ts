// src/rendering/body-footer/nav.body-footer.renderer.ts

import type { AppRenderContextFooterNavigation } from "@shared-types/config/navigation/footer/app-render-context.footer.navigation.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

import { renderTextLink } from "@rendering/shared/link.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderFooterNavLink = (link: AppRenderContextLink): string => {
  return `<li>
    ${renderTextLink(link)}
  </li>`;
};

const renderFooterNavSection = (
  section: AppRenderContextFooterNavigation["sections"][number],
): string => {
  return `<section class="l-footer__group l-footer__group--${escapeAttribute(section.id)}">
    <h3 class="l-footer__heading">${escapeHtml(section.label)}</h3>
    <ul class="l-footer__list">
      ${section.items.map(renderFooterNavLink).join("")}
    </ul>
  </section>`;
};

export const renderBodyFooterNav = (
  nav: AppRenderContextFooterNavigation,
): string => {
  return `<div class="l-footer__grid">
    ${nav.sections.map(renderFooterNavSection).join("")}
  </div>`;
};
