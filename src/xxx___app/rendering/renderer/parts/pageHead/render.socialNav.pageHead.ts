// src/app/rendering/renderer/parts/pageHead/render.socialNav.pageHead.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { renderSvg } from "@app/rendering/renderer/utils/renderSvg.util.renderer";
import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";
import { escapeHtml } from "@app/rendering/renderer/utils/escapeHtml.util.renderer";

export const renderSocialNav = (ctx: DocumentRenderContext): string => {
  const items = ctx.pageHead.navigation.social
    .map((item) => {
      const content = item.icon
        ? renderSvg(item.icon, {
            className: "l-header__icon",
            ariaHidden: true,
          })
        : `<span class="l-header__label">${escapeHtml(item.label)}</span>`;

      return `<li class="l-header__item">
        <a class="l-header__link" href="${escapeAttribute(item.href)}" aria-label="${escapeAttribute(item.label)}">
          ${content}
        </a>
      </li>`;
    })
    .join("");

  return `<div class="l-header__social">
    <ul class="l-header__list l-header__list--social">
      ${items}
    </ul>
  </div>`;
};
