// src/request/response/robots.response.request.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

export const resolveRobotsResponseHeader = (
  robots: AppRenderContext["responsePolicy"]["robots"],
  env: Env,
): string | null => {
  const directives = new Set(robots);

  if (env.APP_ENV !== "prod") {
    directives.add("noindex");
    directives.add("nofollow");
    directives.add("noarchive");
    directives.add("nosnippet");
    directives.add("noimageindex");
  }

  return directives.size === 0 ? null : [...directives].join(", ");
};
