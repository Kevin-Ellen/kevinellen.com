// src/app/rendering/document/shell/pageFooter.render.shell.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeAttribute, escapeHtmlContent } from "@utils/escapeContent.util";

const renderSvgUse = (
  svgId: string,
  className: string,
  width: number,
  height: number,
): string => {
  return `<svg class="${escapeAttribute(className)}" aria-hidden="true" width="${width}" height="${height}">
    <use href="#${escapeAttribute(svgId)}"></use>
  </svg>`;
};

const renderFooterItem = (href: string, label: string): string => {
  return `<li>
    <a href="${escapeAttribute(href)}">${escapeHtmlContent(label)}</a>
  </li>`;
};

const renderFooterSection = (
  section: DocumentRenderContext["pageFooter"]["navigation"]["sections"][number],
): string => {
  const items = section.items
    .map((item) => renderFooterItem(item.href, item.label))
    .join("");

  return `<section class="l-footer__group l-footer__group--${escapeAttribute(section.id)}">
    <h3 class="l-footer__heading">${escapeHtmlContent(section.label)}</h3>
    <ul class="l-footer__list">
      ${items}
    </ul>
  </section>`;
};

const renderFooterNavigation = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const sections = documentRenderContext.pageFooter.navigation.sections
    .map((section) => renderFooterSection(section))
    .join("");

  return `<div class="l-footer__grid">
    ${sections}
  </div>`;
};

const renderFooterConservationOrganisation = (
  organisation: DocumentRenderContext["pageFooter"]["conservation"]["organisations"][number],
): string => {
  return `<li>
    <a href="${escapeAttribute(organisation.href)}" aria-label="${escapeAttribute(organisation.label)}">
      ${renderSvgUse(
        organisation.svgId,
        organisation.iconClassName,
        organisation.width,
        organisation.height,
      )}
    </a>
  </li>`;
};

const renderFooterConservation = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const { conservation } = documentRenderContext.pageFooter;

  const organisations = conservation.organisations
    .map((organisation) => renderFooterConservationOrganisation(organisation))
    .join("");

  return `<section class="l-footer__conservation" aria-labelledby="footer-conservation-heading">
    <h3 id="footer-conservation-heading" class="l-footer__heading">${escapeHtmlContent(conservation.heading)}</h3>
    <p class="l-footer__intro">
      ${escapeHtmlContent(conservation.intro)}
    </p>
    <ul class="l-footer__logos" aria-label="Supported organisations">
      ${organisations}
    </ul>
  </section>`;
};

const renderFooterMeta = (
  documentRenderContext: DocumentRenderContext,
): string => {
  return `<div class="l-footer__meta">
    <p>${escapeHtmlContent(documentRenderContext.pageFooter.meta.copyright)}</p>
  </div>`;
};

export const renderPageFooter = (
  documentRenderContext: DocumentRenderContext,
): string => {
  return `<footer class="l-footer">
    <h2 class="u-sr-only">${escapeHtmlContent(documentRenderContext.pageFooter.meta.screenReaderHeading)}</h2>
    <div class="l-page__frame">
      ${renderFooterNavigation(documentRenderContext)}
      ${renderFooterConservation(documentRenderContext)}
      ${renderFooterMeta(documentRenderContext)}
    </div>
  </footer>`;
};
