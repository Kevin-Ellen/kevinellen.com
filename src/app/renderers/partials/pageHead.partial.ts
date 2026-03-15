// src/app/renderers/partials/pageHead.partial.ts

// import type { AppPage } from "@types-src/appPage.types";

const renderPageHead = (): string => {
  return `
<header class="l-header">
  <div class="l-page__frame">
    <nav class="l-header__primary" aria-label="Primary">
      <div class="l-header__nav">
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
      </div>

      <div class="l-header__social">
        <ul class="l-header__list l-header__list--social">
          <li class="l-header__item">
            <a class="l-header__link" href="#" aria-label="GitHub">
              <svg class="l-header__icon" aria-hidden="true" width="1" height="1">
                <use href="#icon-github"></use>
              </svg>
            </a>
          </li>
          <li class="l-header__item">
            <a class="l-header__link" href="#" aria-label="Instagram">
              <svg class="l-header__icon" aria-hidden="true" width="1" height="1">
                <use href="#icon-instagram"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <nav class="l-header__breadcrumb" aria-label="Breadcrumb">
      <ol class="l-header__breadcrumb-list">
        <li class="l-header__breadcrumb-item">
          <a class="l-header__breadcrumb-link" href="/">Home</a>
        </li>
        <li class="l-header__breadcrumb-item">
          <a class="l-header__breadcrumb-link" href="/journal">Journal</a>
        </li>
        <li class="l-header__breadcrumb-item" aria-current="page">
          The Marsh at First Light
        </li>
      </ol>
    </nav>
  </div>
</header>

<div class="l-header-sentinel" aria-hidden="true"></div>`;
};
export default renderPageHead;
