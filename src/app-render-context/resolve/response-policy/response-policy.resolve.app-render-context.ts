// src/app-render-context/resolve/response-policy.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextResponsePolicy } from "@app-render-context/types/response-policy.app-render-context.types";

import { resolveRobotsAppRenderContext } from "@app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context";

type ResolveResponsePolicyContext = Readonly<{
  nonce: string;
}>;

export const resolveResponsePolicyAppRenderContext = (
  appContext: AppContext,
  context: ResolveResponsePolicyContext,
): AppRenderContextResponsePolicy => {
  const directives = resolveRobotsAppRenderContext(appContext.robots);

  return {
    robots: directives,
    nonce: context.nonce,
    status: appContext.page.status ?? 200,
  };
};
