// src/app-render-context/resolve/response-policy/robots.response-policy.resolve.app-render-context.ts

import type { AppContextPageRobotsDirectives } from "@shared-types/page-definitions/robots/app-context.robots.page-definition.types";
import type {
  AppRenderContextRobotsDirective,
  AppRenderContextRobotsDirectives,
} from "@shared-types/page-definitions/robots/app-render-context.robots.page-definition.types";

const INVERTED_ROBOTS_MAP = {
  allowIndex: "noindex",
  allowFollow: "nofollow",
} as const satisfies Record<
  "allowIndex" | "allowFollow",
  AppRenderContextRobotsDirective
>;

const DIRECT_ROBOTS_KEYS = [
  "noarchive",
  "nosnippet",
  "noimageindex",
] as const satisfies readonly AppRenderContextRobotsDirective[];

export const resolveRobotsAppRenderContext = (
  robots: AppContextPageRobotsDirectives | null,
): AppRenderContextRobotsDirectives => {
  if (robots === null) {
    return [];
  }

  const directives: AppRenderContextRobotsDirective[] = [];

  for (const [sourceKey, targetDirective] of Object.entries(
    INVERTED_ROBOTS_MAP,
  ) as readonly [
    keyof typeof INVERTED_ROBOTS_MAP,
    AppRenderContextRobotsDirective,
  ][]) {
    if (!robots[sourceKey]) {
      directives.push(targetDirective);
    }
  }

  for (const key of DIRECT_ROBOTS_KEYS) {
    if (robots[key]) {
      directives.push(key);
    }
  }

  return directives;
};
