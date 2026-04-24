// shared-types/assets/svg/app-render-context.svg.assets.types.ts

import type { AppContextSvgAsset } from "@shared-types/assets/svg/app-context.svg.assets.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

export type AppRenderContextSvgAsset = AppContextSvgAsset;

export type AppRenderContextSvgReference = Readonly<{
  id: SvgAssetId;
  width: number;
  height: number;
}>;
