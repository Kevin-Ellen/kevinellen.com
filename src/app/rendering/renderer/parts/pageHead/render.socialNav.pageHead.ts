// src/app/rendering/renderer/parts/pageHead/render.socialNav.pageHead.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";
import { escapeHtml } from "@app/rendering/renderer/utils/escapeHtml.util.renderer";

export const renderSocialNav = (ctx: DocumentRenderContext): string => {
  const items = ctx.pageHead.navigation.social
    .map((item) => {
      const icon = item.iconId
        ? `<svg class="l-header__icon" aria-hidden="true" width="1" height="1">
            <use href="#${escapeAttribute(item.iconId)}"></use>
          </svg>`
        : escapeHtml(item.label);

      return `<li class="l-header__item">
        <a class="l-header__link" href="${escapeAttribute(item.href)}" aria-label="${escapeAttribute(item.label)}">
          ${icon}
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
