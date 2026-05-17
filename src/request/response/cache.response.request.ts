// src/request/response/cache.response.request.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

export const resolveHtmlCacheControlHeader = (
  env: Env,
  status: AppRenderContext["responsePolicy"]["status"],
): string => {
  if (env.APP_ENV !== "prod") {
    return "no-store";
  }

  if (status >= 400) {
    return "no-store";
  }

  return "public, max-age=0, must-revalidate";
};
