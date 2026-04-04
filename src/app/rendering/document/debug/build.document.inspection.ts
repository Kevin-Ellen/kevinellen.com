// src/app/rendering/document/debug/build.document.inspection.ts

import type { AppContext } from "@app/appContext/class.appContext";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

const buildInspectableTarget = (target: DocumentRenderTarget) => {
  return {
    kind: target.kind,
    status: target.status,
    page: {
      id: target.page.core.id,
      slug: target.kind === "page" ? target.page.core.slug : undefined,
      label: target.page.core.label,
      kind: target.page.core.kind,
    },
  };
};

const buildInspectableAssets = (appContext: AppContext) => {
  const assets = appContext.getAssets();

  return {
    scripts: assets.scripts.map((script) => ({
      id: script.id,
      kind: script.kind,
      location: script.location,
    })),
    svgs: assets.svgs.map((svg) => ({
      id: svg.id,
      viewBox: svg.viewBox,
    })),
  };
};

export const buildDocumentInspection = (
  req: Request,
  target: DocumentRenderTarget,
  appContext: AppContext,
) => {
  return {
    type: "document-inspection",

    request: {
      url: req.url,
      method: req.method,
    },

    target: buildInspectableTarget(target),

    appContext: {
      site: {
        siteName: appContext.getSiteConfig().siteName,
        siteUrl: appContext.getSiteConfig().siteUrl,
      },
      canonicalUrl: appContext.getCanonicalUrl(),
      navigation: appContext.getNavigation(),
      breadcrumbs: appContext.getBreadcrumbs(),
      assets: buildInspectableAssets(appContext),
      structuredData: appContext.getStructuredData(),
      content: appContext.getContent(),
      security: appContext.getSecurity(),
    },
  };
};
