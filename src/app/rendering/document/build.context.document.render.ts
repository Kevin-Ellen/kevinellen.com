// src/app/rendering/document/build.context.document.render.ts

import type { AppContext } from "@app/appContext/class.appContext";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";
import type {
  SvgAssetConfig,
  SvgAssetId,
} from "@shared-types/config/assets.config.types";

const getSvgDimensionsFromViewBox = (
  viewBox: string,
): {
  width: number;
  height: number;
} => {
  const parts = viewBox.trim().split(/\s+/);

  if (parts.length !== 4) {
    throw new Error(`Invalid SVG viewBox: ${viewBox}`);
  }

  const width = Number(parts[2]);
  const height = Number(parts[3]);

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(`Invalid SVG viewBox dimensions: ${viewBox}`);
  }

  return { width, height };
};

const resolveSvgAssets = (
  svgs: readonly SvgAssetConfig[],
): ReadonlyMap<
  SvgAssetId,
  SvgAssetConfig & {
    width: number;
    height: number;
  }
> => {
  return new Map(
    svgs.map((svg) => [
      svg.id,
      {
        ...svg,
        ...getSvgDimensionsFromViewBox(svg.viewBox),
      },
    ]),
  );
};

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
  const branding = appContext.getBranding();

  const svgAssetsById = resolveSvgAssets(assets.svgs);

  const brandingLogoSvg = svgAssetsById.get(branding.header.logoSvgId);

  if (!brandingLogoSvg) {
    throw new Error(
      `Missing header branding SVG asset for id: ${branding.header.logoSvgId}`,
    );
  }

  const footerAffiliations =
    footer.affiliations?.items.map((item) => {
      const svg = svgAssetsById.get(item.svgId);

      if (!svg) {
        throw new Error(
          `Missing footer affiliation SVG asset for id: ${item.svgId}`,
        );
      }

      return {
        id: item.id,
        label: item.label,
        href: item.href,
        svgId: item.svgId,
        iconClassName: `l-footer__icon l-footer__icon--${item.id}`,
        width: svg.width,
        height: svg.height,
      };
    }) ?? [];

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
    pageHeader: {
      branding: {
        href: branding.header.href,
        ariaLabel: branding.header.ariaLabel,
        logo: {
          id: brandingLogoSvg.id,
          width: brandingLogoSvg.width,
          height: brandingLogoSvg.height,
          className: "l-header__brand-logo",
        },
      },
      navigation: {
        primary: navigation.header.primary.map((item) => ({ ...item })),
        social: navigation.header.social.map((item) => ({ ...item })),
      },
      breadcrumbs: breadcrumbs.map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
      })),
    },
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
        organisations: footerAffiliations,
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
