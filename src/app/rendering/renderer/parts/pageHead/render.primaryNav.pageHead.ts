// src/app/rendering/renderer/parts/pageHead/render.primaryNav.pageHead.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

export const renderPrimaryNav = (_ctx: DocumentRenderContext): string => {
  const html = `<div class="l-header__nav">
  <ul class="l-header__list">
              <li class="l-header__item l-header__item--home">
                <a class="l-header__link" href="/" aria-label="Home">
                  <svg class="l-header__icon" aria-hidden="true" width="1" height="1">
                    <use href="#icon-home"></use>
                  </svg>
                </a>
              </li>
              <li class="l-header__item">
                <a class="l-header__link" href="/journal">Journal</a>
              </li>
              <li class="l-header__item">
                <a class="l-header__link" href="/photos">Photos</a>
              </li>
              <li class="l-header__item">
                <a class="l-header__link" href="/about">About</a>
              </li>
            </ul>
            </div>`;
  return html;
};
