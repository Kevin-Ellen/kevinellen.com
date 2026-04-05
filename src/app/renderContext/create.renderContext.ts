// src/app/renderContext/create.renderContext.ts

import type { AppContext } from "@app/appContext/class.appContext";

import { RenderContext } from "@app/renderContext/class.renderContext";

import { deepFreeze } from "@utils/deepFreeze.util";

const createNonce = (): string => {
  return crypto.randomUUID().replace(/-/g, "");
};

export const createRenderContext = (appContext: AppContext): RenderContext => {
  return new RenderContext(
    deepFreeze({
      document: {
        status: appContext.target.status,
        language: appContext.site.language,
        siteName: appContext.site.siteName,
      },
      page: {
        id: appContext.page.core.id,
        kind: appContext.page.core.kind,
        label: appContext.page.core.label,
        title: appContext.page.meta.pageTitle,
        description: appContext.page.meta.metaDescription,
      },
      metadata: appContext.metadata,
      breadcrumbs: appContext.breadcrumbs,
      navigation: appContext.navigation,
      security: {
        nonce: createNonce(),
      },
    }),
  );
};
