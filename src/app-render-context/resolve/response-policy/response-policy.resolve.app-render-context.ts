// src/app-render-context/resolve/response-policy.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextResponsePolicy } from "@app-render-context/types/response-policy.app-render-context.types";

import { appRenderContextResolveRobots } from "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context";

type ResolveResponsePolicyContext = Readonly<{
  nonce: string;
}>;

export const appRenderContextResolveResponsePolicy = (
  appContext: AppContext,
  context: ResolveResponsePolicyContext,
): AppRenderContextResponsePolicy => {
  const directives = appRenderContextResolveRobots(appContext.robots);

  return {
    robots: directives,
    nonce: context.nonce,
    status: appContext.page.status ?? 200,
  };
};
