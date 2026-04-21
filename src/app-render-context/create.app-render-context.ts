// src/app-render-context/create.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";

import { AppRenderContext } from "@app-render-context/class.app-render-context";

import { resolveDocOpenAppRenderContext } from "@app-render-context/resolve/doc-open.resolve.app-render-context";
import { resolveDocCloseAppRenderContext } from "@app-render-context/resolve/doc-close.resolve.app-render-context";
import { resolveResponsePolicyAppRenderContext } from "@app-render-context/resolve/response-policy.resolve.app-render-context";

import { createNonceAppRenderContext } from "@app-render-context/shared/create-nonce.app-render-context";

export const appRenderContextCreate = (
  appContext: AppContext,
): AppRenderContext => {
  const nonce = createNonceAppRenderContext();

  return new AppRenderContext({
    responsePolicy: resolveResponsePolicyAppRenderContext(appContext, {
      nonce,
    }),
    docOpen: resolveDocOpenAppRenderContext(appContext, { nonce }),
    docClose: resolveDocCloseAppRenderContext(appContext, { nonce }),
  });
};
