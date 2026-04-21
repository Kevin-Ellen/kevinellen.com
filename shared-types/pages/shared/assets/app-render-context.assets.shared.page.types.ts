// shared-types/pages/shared/assets/app-render-context.assets.shared.page.types.ts

import type { AppRenderContextScriptAsset } from "@shared-types/assets/scripts/app-render-context.scripts.assets.types";
import type { AppContextSvgAsset } from "@shared-types/assets/svg/app-context.svg.assets.types";

export type AppRenderContextDocOpenAssets = Readonly<{
  scripts: readonly AppRenderContextScriptAsset[];
}>;

export type AppRenderContextDocCloseAssets = Readonly<{
  scripts: readonly AppRenderContextScriptAsset[];
  svg: readonly AppContextSvgAsset[];
}>;
