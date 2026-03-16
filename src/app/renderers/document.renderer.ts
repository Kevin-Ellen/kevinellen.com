// src/app/renderers/document.renderer.ts

import CSS from "@generated/styles.css?raw";

import type { AppPage, DocFooter } from "@types-src/appPage.types";
import type { SiteConfig } from "@types-src/siteConfig.types";
import type { RenderedDocument } from "@types-src/renderedDocument.types";

import renderDocHead from "@app/renderers/partials/docHead.partial";
import renderPageHead from "@app/renderers/partials/pageHead.partial";
import renderPageFooter from "@app/renderers/partials/pageFooter.partial";
import renderDocFooter from "@app/renderers/partials/docFooter.partial";

import buildBreadcrumbStructuredData from "@app/builders/structuredData.builder";

const documentRenderer = (
  siteConfig: SiteConfig,
  page: AppPage,
): RenderedDocument => {
  const breadcrumbStructuredData = buildBreadcrumbStructuredData(
    page.pageHead.breadcrumbs,
    siteConfig.siteUrl,
  );

  const enrichedPageDocFooter: DocFooter = {
    scripts: [...page.docFooter.scripts],
    inlineSvgSprite: [...page.docFooter.inlineSvgSprite],
    structuredData: [
      ...page.docFooter.structuredData,
      breadcrumbStructuredData,
    ],
  };

  const mergedDocFooter = mergeDocFooter(
    siteConfig.docFooter,
    enrichedPageDocFooter,
  );

  const docHeadFragment = renderDocHead(
    siteConfig,
    page.docHead,
    CSS,
    mergedDocFooter.scripts,
  );

  const pageHtml = renderPage(page);
  const docFooterFragment = renderDocFooter(mergedDocFooter);

  return {
    html: [docHeadFragment.html, pageHtml, docFooterFragment.html].join(""),
    inlineAssets: [
      ...docHeadFragment.inlineAssets,
      ...docFooterFragment.inlineAssets,
    ],
  };
};

export default documentRenderer;

const renderPage = (page: AppPage): string => {
  return [
    renderPageHead(page.pageHead),
    `<main>${page.content}</main>`,
    renderPageFooter(),
  ].join("");
};

const mergeDocFooter = (
  siteDocFooter: DocFooter,
  pageDocFooter: DocFooter,
): DocFooter => {
  return {
    scripts: [
      ...(siteDocFooter.scripts ?? []),
      ...(pageDocFooter.scripts ?? []),
    ],
    inlineSvgSprite: [
      ...(siteDocFooter.inlineSvgSprite ?? []),
      ...(pageDocFooter.inlineSvgSprite ?? []),
    ],
    structuredData: [
      ...(siteDocFooter.structuredData ?? []),
      ...(pageDocFooter.structuredData ?? []),
    ],
  };
};
