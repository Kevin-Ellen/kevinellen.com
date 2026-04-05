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
      status: appContext.target.status,
      page: {
        id: appContext.page.core.id,
        kind: appContext.page.core.kind,
        label: appContext.page.core.label,
      },
      metadata: appContext.metadata,
      security: {
        nonce: createNonce(),
      },
    }),
  );
};
