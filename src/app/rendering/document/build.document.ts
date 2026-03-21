// src/app/rendering/document/build.document.render.ts

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { buildAssets } from "@app/rendering/document/assets/build.assets.document.rendering";
import { buildCanonicalUrl } from "@app/rendering/document/canonical/build.canonical.document.rendering";
import { resolveBreadcrumbs } from "@app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering";
import { buildStructuredData } from "@app/rendering/document/structured-data/build.structured-data.document.rendering";

export const buildDocumentRender = (
  appState: AppState,
  page: PageDefinition,
  nonce: string,
): DocumentRenderContext => {
  const breadcrumbs = Object.freeze([...resolveBreadcrumbs(appState, page)]);
  const assets = buildAssets(appState, page);
  const structuredData = Object.freeze([
    ...buildStructuredData(appState, page),
  ]);

  const documentRender: DocumentRenderContext = {
    security: Object.freeze({
      nonce,
    }),
    site: Object.freeze({
      language: appState.siteConfig.language,
      siteName: appState.siteConfig.siteName,
      siteUrl: appState.siteConfig.siteUrl,
      socialMedia: appState.siteConfig.socialMedia,
    }),
    page: Object.freeze({
      id: page.core.id,
      kind: page.core.kind,
      slug: page.core.slug,
      renderMode: page.core.renderMode,
    }),
    seo: Object.freeze({
      pageTitle: page.docHead.pageTitle,
      metaDescription: page.docHead.metaDescription,
      canonicalUrl: buildCanonicalUrl(appState, page),
    }),
    pageHead: Object.freeze({
      breadcrumbs,
    }),
    content: Object.freeze({
      head: Object.freeze({
        eyebrow: page.content.head.eyebrow,
        title: page.content.head.title,
        intro: page.content.head.intro,
      }),
      body: Object.freeze([...page.content.body]),
      footer: Object.freeze([...page.content.footer]),
    }),
    assets: Object.freeze({
      scripts: Object.freeze([...assets.scripts]),
      svgs: Object.freeze([...assets.svgs]),
    }),
    structuredData,
  };

  return Object.freeze(documentRender);
};
