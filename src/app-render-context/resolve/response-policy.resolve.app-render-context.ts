// src/app-render-context/resolve/response-policy.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextResponsePolicy } from "@app-render-context/types/response-policy.app-render-context.types";

type ResolveResponsePolicyContext = Readonly<{
  nonce: string;
}>;

export const resolveResponsePolicyAppRenderContext = (
  appContext: AppContext,
  context: ResolveResponsePolicyContext,
): AppRenderContextResponsePolicy => {
  return {
    robots: appContext.robots ?? null,
    nonce: context.nonce,
  };
};
