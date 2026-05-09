// src/rendering/body-footer/body-footer.renderer.ts

import type { AppRenderContextBodyFooter } from "@app-render-context/types/body-footer.app-render-context.types";

import { renderBodyFooterAffiliations } from "@rendering/body-footer/affiliations.body-footer.renderer";
import { renderBodyFooterColophon } from "@rendering/body-footer/colophon.body-footer.renderer";
import { renderBodyFooterNav } from "@rendering/body-footer/nav.body-footer.renderer";

export const renderBodyFooter = (
  bodyFooter: AppRenderContextBodyFooter,
): string =>
  [
    `<footer class="l-footer">`,
    `<h2 class="u-sr-only">Footer</h2>`,
    `<div class="l-page__frame">`,
    renderBodyFooterNav(bodyFooter.nav),
    renderBodyFooterAffiliations(bodyFooter.affiliations),
    renderBodyFooterColophon(bodyFooter.colophon),
    `</div>`,
    `</footer>`,
  ].join("");
