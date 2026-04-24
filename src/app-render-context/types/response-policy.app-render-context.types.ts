// src/app-render-context/types/response-policy.app-render-context.types.ts

import type { AppRenderContextRobotsDirectives } from "@shared-types/page-definitions/robots/app-render-context.robots.page-definition.types";
import type { ErrorPageStatus } from "@shared-types/page-definitions/shared/shared.error.page-definition.types";

export type AppRenderContextResponsePolicy = Readonly<{
  robots: AppRenderContextRobotsDirectives;
  nonce: string;
  status: ErrorPageStatus | 200;
}>;
