// src/app-render-context/types/doc-close.app-render-context.types.ts

import type {
  AppRenderContextInlineScript,
  AppRenderContextLinkScript,
} from "@shared-types/assets/scripts/app-render-context.scripts.assets.types";
import type { AppRenderContextSvgAsset } from "@shared-types/assets/svg/app-render-context.svg.assets.types";
import type { AppRenderContextStructuredDataEntry } from "@shared-types/structured-data/app-render-context.structured-data.types";

export type AppRenderContextDocClose = Readonly<{
  inlineScripts: readonly AppRenderContextInlineScript[];
  linkScripts: readonly AppRenderContextLinkScript[];
  svg: readonly AppRenderContextSvgAsset[];
  structuredData: readonly AppRenderContextStructuredDataEntry[];
}>;
