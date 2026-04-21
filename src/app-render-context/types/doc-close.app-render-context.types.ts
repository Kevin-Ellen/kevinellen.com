// src/app-render-context/types/doc-close.app-render-context.types.ts

import type { AppRenderContextDocCloseAssets } from "@shared-types/pages/shared/assets/app-render-context.assets.shared.page.types";
import type { AppRenderContextStructuredDataEntry } from "@shared-types/structured-data/app-render-context.structured-data.types";

export type AppRenderContextDocClose = Readonly<{
  assets: AppRenderContextDocCloseAssets;
  structuredData: readonly AppRenderContextStructuredDataEntry[];
}>;
