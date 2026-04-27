// src/rendering/body-footer/affiliations.body-footer.renderer.ts

import type { AppRenderContextBodyFooterAffiliations } from "@app-render-context/types/body-footer.app-render-context.types";

import { renderLinkAttributes } from "@rendering/shared/link.shared.renderer";
import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";

const renderAffiliationItem = (
  item: AppRenderContextBodyFooterAffiliations["items"][number],
): string => {
  return `<li>
    <a ${renderLinkAttributes({
      kind: "external",
      href: item.href,
      text: item.ariaLabel,
      openInNewTab: true,
      svg: null,
      ariaLabel: item.ariaLabel,
    })}>
      ${renderSvgReference(item.logo, "l-footer__icon")}
    </a>
  </li>`;
};

export const renderBodyFooterAffiliations = (
  affiliations: AppRenderContextBodyFooterAffiliations,
): string => {
  return `<section class="l-footer__conservation" aria-labelledby="footer-conservation-heading">
    <h3 id="footer-conservation-heading" class="l-footer__heading">Conservation</h3>
    <ul class="l-footer__logos" aria-label="Supported organisations">
      ${affiliations.items.map(renderAffiliationItem).join("")}
    </ul>
  </section>`;
};
