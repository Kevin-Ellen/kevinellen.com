// src/app/rendering/shell/pageFooter.render.shell.ts

import type { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { RenderContext } from "@app/renderContext/class.renderContext";
import type {
  RenderContextFooterNavigationItem,
  RenderContextFooterNavigationSection,
  RenderContextPageFooter,
  RenderContextPageFooterAffiliationItem,
} from "@app/renderContext/renderContext.types";

import {
  escapeAttribute,
  escapeHtmlContent,
} from "@app/rendering/utils/escapeContent.util";

const renderSvgUse = (
  svgId: SvgAssetId,
  className: string,
  width: number,
  height: number,
): string => {
  return `<svg class="${escapeAttribute(
    className,
  )}" aria-hidden="true" width="${width}" height="${height}">
    <use href="#${escapeAttribute(svgId)}"></use>
  </svg>`;
};

const renderFooterItem = (item: RenderContextFooterNavigationItem): string => {
  return `<li>
    <a href="${escapeAttribute(item.href)}">${escapeHtmlContent(item.label)}</a>
  </li>`;
};

const renderFooterSection = (
  section: RenderContextFooterNavigationSection,
): string => {
  return `<section class="l-footer__group l-footer__group--${escapeAttribute(
    section.id,
  )}">
    <h3 class="l-footer__heading">${escapeHtmlContent(section.label)}</h3>
    <ul class="l-footer__list">
      ${section.items.map((item) => renderFooterItem(item)).join("")}
    </ul>
  </section>`;
};

const renderFooterNavigation = (
  sections: readonly RenderContextFooterNavigationSection[],
): string => {
  return `<div class="l-footer__grid">
    ${sections.map((section) => renderFooterSection(section)).join("")}
  </div>`;
};

const renderFooterAffiliationItem = (
  item: RenderContextPageFooterAffiliationItem,
): string => {
  return `<li>
    <a href="${escapeAttribute(item.href)}" aria-label="${escapeAttribute(
      item.label,
    )}">
      ${renderSvgUse(item.svg.id, "l-footer__logo", item.svg.width, item.svg.height)}
    </a>
  </li>`;
};

const renderFooterAffiliations = (
  affiliations: RenderContextPageFooter["affiliations"],
): string => {
  if (!affiliations) {
    return "";
  }

  return `<section class="l-footer__affiliations" aria-labelledby="footer-affiliations-heading">
    <h3 id="footer-affiliations-heading" class="l-footer__heading">${escapeHtmlContent(
      affiliations.title,
    )}</h3>
    <p class="l-footer__intro">
      ${escapeHtmlContent(affiliations.description)}
    </p>
    <ul class="l-footer__logos" aria-label="Affiliations">
      ${affiliations.items.map((item) => renderFooterAffiliationItem(item)).join("")}
    </ul>
  </section>`;
};

const renderFooterColophon = (
  colophon: RenderContextPageFooter["colophon"],
): string => {
  if (!colophon) {
    return "";
  }

  const copyright = `© ${colophon.copyrightYear} ${colophon.copyrightName}`;
  const allRightsReserved = colophon.allRightsReserved
    ? ". All rights reserved."
    : "";

  return `<div class="l-footer__meta">
    <p>${escapeHtmlContent(copyright + allRightsReserved)}</p>
  </div>`;
};

export const pageFooterRenderShell = (ctx: RenderContext): string => {
  return `<footer class="l-footer">
    <h2 class="u-sr-only">Footer</h2>
    <div class="l-page__frame">
      ${renderFooterNavigation(ctx.pageFooter.navigation.sections)}
      ${renderFooterAffiliations(ctx.pageFooter.affiliations)}
      ${renderFooterColophon(ctx.pageFooter.colophon)}
    </div>
  </footer>`;
};
