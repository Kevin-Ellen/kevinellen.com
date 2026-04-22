// src/app-render-context/types/response-policy.app-render-context.types.ts

import type { AppStatePageRobotsDirectives } from "@shared-types/page-definitions/robots/app-state.robots.page-definition.types";

export type AppRenderContextResponsePolicy = Readonly<{
  robots: AppStatePageRobotsDirectives | null;
  nonce: string;
}>;
