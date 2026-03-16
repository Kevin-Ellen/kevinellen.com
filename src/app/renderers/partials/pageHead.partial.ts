// src/app/renderers/partials/pageHead.partial.ts

import type { BreadcrumbItem, PageHead } from "@types-src/appPage.types";

// import type { AppPage } from "@types-src/appPage.types";

const renderPageHead = (pageHead: PageHead): string => {
  const breadcrumbsMarkup = renderBreadcrumbs(pageHead.breadcrumbs);

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

    ${breadcrumbsMarkup}
  </div>
</header>

<div class="l-header-sentinel" aria-hidden="true"></div>`;
};
export default renderPageHead;

const renderBreadcrumbs = (breadcrumbs: PageHead["breadcrumbs"]): string => {
  if (!breadcrumbs?.length) {
    return "";
  }

  const itemsMarkup = breadcrumbs
    .map((breadcrumb, index) =>
      renderBreadcrumbItem(breadcrumb, index, breadcrumbs.length),
    )
    .join("");

  return `
    <nav class="l-header__breadcrumb" aria-label="Breadcrumb">
      <ol class="l-header__breadcrumb-list">
        ${itemsMarkup}
      </ol>
    </nav>
  `;
};

const renderBreadcrumbItem = (
  breadcrumb: BreadcrumbItem,
  index: number,
  total: number,
): string => {
  const isCurrentPage = index === total - 1;

  if (isCurrentPage) {
    return `
      <li class="l-header__breadcrumb-item" aria-current="page">
        ${escapeHtml(breadcrumb.label)}
      </li>
    `;
  }

  return `
    <li class="l-header__breadcrumb-item">
      <a class="l-header__breadcrumb-link" href="${escapeHtmlAttribute(breadcrumb.href)}">
        ${escapeHtml(breadcrumb.label)}
      </a>
    </li>
  `;
};

const escapeHtml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

const escapeHtmlAttribute = (value: string): string => {
  return escapeHtml(value);
};
