// src/app/rendering/renderer/parts/pageHead/render.pageHead.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { renderPrimaryNav } from "@app/rendering/renderer/parts/pageHead/render.primaryNav.pageHead";
import { renderBreadcrumbs } from "@app/rendering/renderer/parts/pageHead/render.breadcrumbs.pageHead";
import { renderSocialNav } from "@app/rendering/renderer/parts/pageHead/render.socialNav.pageHead";

export const renderPageHead = (ctx: DocumentRenderContext): string => {
  const html = `
  <header class="l-header">
      <div class="l-page__frame">
        <nav class="l-header__primary" aria-label="Primary">
          ${renderPrimaryNav(ctx)}
          ${renderSocialNav(ctx)}
        </nav>

        ${renderBreadcrumbs(ctx)}
      </div>
    </header>

    <div class="l-header-sentinel" aria-hidden="true"></div>`;

  return html;
};
