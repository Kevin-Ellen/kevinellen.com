// src/app/renderContext/create.renderContext.ts

import type { AppContext } from "@app/appContext/class.appContext";

import { RenderContext } from "@app/renderContext/class.renderContext";

import { resolveSvgDimensionsFromViewBox } from "@app/renderContext/resolvers/dimensions.svg.asset.resolve.renderContext";
import { resolveSvgReference } from "@app/renderContext/resolvers/reference.svg.asset.resolve.renderContext";
import { resolvePageFooterRenderContext } from "@app/renderContext/resolvers/pageFooter.resolver.renderContext";
import { resolveContentRenderContext } from "@app/renderContext/resolvers/content.resolve.renderContext";

import { deepFreeze } from "@utils/deepFreeze.util";

const createNonce = (): string => {
  return crypto.randomUUID().replace(/-/g, "");
};

export const createRenderContext = (appContext: AppContext): RenderContext => {
  const renderableBreadcrumbs =
    appContext.breadcrumbs.length >= 2 ? appContext.breadcrumbs : [];

  return new RenderContext(
    deepFreeze({
      document: {
        status: appContext.target.status,
        language: appContext.siteIdentity.language,
        siteName: appContext.siteIdentity.siteName,
      },
      page: {
        id: appContext.page.id,
        kind: appContext.page.kind,
        label: appContext.page.label,
      },
      metadata: appContext.metadata,
      head: {
        scripts: appContext.assets.scripts.filter(
          (script) => script.location === "header",
        ),
      },
      header: {
        branding: {
          href: appContext.branding.homeHref,
          ariaLabel: appContext.branding.ariaLabel,
          logo: resolveSvgReference(
            appContext.assets.svgs,
            appContext.branding.logo.id,
          ),
        },
        navigation: {
          primary: appContext.navigation.header.primary.map((item) => ({
            kind: item.kind,
            id: "id" in item ? item.id : undefined,
            label: item.label,
            href: item.href,
            isCurrent: item.isCurrent,
            icon: item.icon
              ? resolveSvgReference(appContext.assets.svgs, item.icon.id)
              : undefined,
          })),
          social: appContext.navigation.header.social.map((item) => ({
            kind: item.kind,
            id: "id" in item ? item.id : undefined,
            label: item.label,
            href: item.href,
            isCurrent: item.isCurrent,
            icon: item.icon
              ? resolveSvgReference(appContext.assets.svgs, item.icon.id)
              : undefined,
          })),
        },
        breadcrumbs: renderableBreadcrumbs,
      },
      structuredData: {
        items: appContext.structuredData,
      },
      pageFooter: resolvePageFooterRenderContext(appContext),
      footer: {
        scripts: appContext.assets.scripts.filter(
          (script) => script.location === "footer",
        ),
        svgs: appContext.assets.svgs.map((svg) => {
          const { width, height } = resolveSvgDimensionsFromViewBox(
            svg.viewBox,
          );

          return {
            id: svg.id,
            viewBox: svg.viewBox,
            content: svg.content,
            width,
            height,
          };
        }),
      },
      security: {
        nonce: createNonce(),
      },
      content: resolveContentRenderContext(appContext.content),
    }),
  );
};
