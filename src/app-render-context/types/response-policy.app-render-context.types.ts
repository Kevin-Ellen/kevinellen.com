// src/app-render-context/types/response-policy.app-render-context.types.ts

import type { AppStatePageRobotsDirectives } from "@shared-types/pages/shared/app-state.robots.shared.page.types";

export type AppRenderContextResponsePolicy = Readonly<{
  robots: AppStatePageRobotsDirectives | null;
  nonce: string;
}>;
