// shared-types/page-definitions/robots/app-render-context.robots.page-definition.types.ts

import type { AppContextPageRobotsDirectives } from "@shared-types/page-definitions/robots/app-context.robots.page-definition.types";

type DirectRobotsDirective = Exclude<
  keyof AppContextPageRobotsDirectives,
  "allowIndex" | "allowFollow"
>;

export type AppRenderContextRobotsDirective =
  | DirectRobotsDirective
  | "noindex"
  | "nofollow";

export type AppRenderContextRobotsDirectives =
  readonly AppRenderContextRobotsDirective[];
