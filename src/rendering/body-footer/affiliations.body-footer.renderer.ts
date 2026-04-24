// src/rendering/body-footer/affiliations.body-footer.renderer.ts

import type { AppRenderContextBodyFooterAffiliations } from "@app-render-context/types/body-footer.app-render-context.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

const renderAffiliationItem = (
  item: AppRenderContextBodyFooterAffiliations["items"][number],
): string => {
  return `<li>
    <a href="${escapeAttribute(item.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttribute(item.ariaLabel)}">
      <svg class="l-footer__logo" aria-hidden="true" width="${item.logo.width}" height="${item.logo.height}">
        <use href="#${escapeAttribute(item.logo.id)}"></use>
      </svg>
    </a>
  </li>`;
};

export const renderBodyFooterAffiliations = (
  affiliations: AppRenderContextBodyFooterAffiliations,
): string => {
  return `<section class="l-footer__affiliations" aria-labelledby="footer-affiliations-heading">
    <h3 id="footer-affiliations-heading" class="l-footer__heading">Affiliations</h3>
    <ul class="l-footer__logos" aria-label="Affiliations">
      ${affiliations.items.map(renderAffiliationItem).join("")}
    </ul>
  </section>`;
};
