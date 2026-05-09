// src/app-render-context/create.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";

import { AppRenderContext } from "@app-render-context/class.app-render-context";

import { appRenderContextResolveDocOpen } from "@app-render-context/resolve/doc-open/doc-open.resolve.app-render-context";
import { appRenderContextResolveBodyHeader } from "@app-render-context/resolve/body-header/body-header.resolve.app-render-context";
import { appRenderContextResolveBodyFooter } from "@app-render-context/resolve/body-footer/body-footer.resolve.app-render-context";
import { appRenderContextResolveDocClose } from "@app-render-context/resolve/doc-close/doc-close.resolve.app-render-context";
import { appRenderContextResolveResponsePolicy } from "@app-render-context/resolve/response-policy/response-policy.resolve.app-render-context";

import { createNonceAppRenderContext } from "@app-render-context/shared/create-nonce.app-render-context";
import { appRenderContextResolveBodyContent } from "@app-render-context/resolve/body-content/body-content.resolve.app-render-context";

export const appRenderContextCreate = (
  appContext: AppContext,
  env: Env,
): AppRenderContext => {
  const nonce = createNonceAppRenderContext();
  const origin = `https://${env.APP_HOST}`;

  return new AppRenderContext({
    responsePolicy: appRenderContextResolveResponsePolicy(appContext, {
      nonce,
    }),
    docOpen: appRenderContextResolveDocOpen(appContext, { nonce }),
    bodyHeader: appRenderContextResolveBodyHeader(appContext),
    bodyContent: appRenderContextResolveBodyContent(appContext),
    bodyFooter: appRenderContextResolveBodyFooter(appContext),
    docClose: appRenderContextResolveDocClose(appContext, {
      nonce,
      origin,
    }),
  });
};
