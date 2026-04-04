// src/app/rendering/document/build.context.document.render.ts

import type { AppContext } from "@app/appContext/class.appContext";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

export const buildDocumentRenderContext = (
  appContext: AppContext,
): DocumentRenderContext => {
  const siteConfig = appContext.getSiteConfig();
  const security = appContext.getSecurity();
  const navigation = appContext.getNavigation();
  const breadcrumbs = appContext.getBreadcrumbs();
  const content = appContext.getContent();
  const footer = appContext.getFooter();
  const structuredData = appContext.getStructuredData();
  const canonicalUrl = appContext.getCanonicalUrl();
  const target = appContext.getTarget();
  const assets = appContext.getAssets();

  return {
    security: {
      nonce: security.nonce,
    },
    site: {
      language: siteConfig.language,
      siteName: siteConfig.siteName,
      siteUrl: siteConfig.siteUrl,
    },
    metadata: {
      canonicalUrl,
      pageTitle: target.page.meta.pageTitle,
      metaDescription: target.page.meta.metaDescription,
    },
    navigation: {
      header: {
        primary: navigation.header.primary.map((item) => ({ ...item })),
        social: navigation.header.social.map((item) => ({ ...item })),
      },
    },
    breadcrumbs: breadcrumbs.map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
    })),
    content,
    pageFooter: {
      navigation: {
        sections: navigation.footer.sections.map((section) => ({
          id: section.id,
          label: section.label,
          items: section.items.map((item) => ({
            label: item.label,
            href: item.href,
          })),
        })),
      },
      conservation: {
        heading: footer.affiliations?.title ?? "",
        intro: footer.affiliations?.description ?? "",
        organisations:
          footer.affiliations?.items.map((item) => ({
            id: item.id,
            label: item.label,
            href: item.href,
            svgId: item.svgId,
            iconClassName: `l-footer__icon l-footer__icon--${item.id}`,
            width: item.width,
            height: item.height,
          })) ?? [],
      },
      meta: {
        screenReaderHeading: "Page footer",
        copyright: footer.colophon
          ? `© ${footer.colophon.copyrightYear} ${footer.colophon.copyrightName}`
          : "",
      },
    },
    structuredData: {
      person: structuredData.person,
      website: structuredData.website,
      page: structuredData.page,
    },
    assets: {
      header: {
        scripts: assets.scripts
          .filter((script) => script.location === "header")
          .map((script) => ({ ...script })),
      },
      footer: {
        scripts: assets.scripts
          .filter((script) => script.location === "footer")
          .map((script) => ({ ...script })),
        svgs: assets.svgs.map((svg) => ({ ...svg })),
      },
    },
  };
};
