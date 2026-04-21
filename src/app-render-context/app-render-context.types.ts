// src/app-render-context/app-render-context.types.ts

import type { AppRenderContextResponsePolicy } from "@app-render-context/types/response-policy.app-render-context.types";
import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";
import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";

export type AppRenderContextData = Readonly<{
  responsePolicy: AppRenderContextResponsePolicy;
  docOpen: AppRenderContextDocOpen;
  bodyHeader: AppRenderContextBodyHeader;
  docClose: AppRenderContextDocClose;
}>;
