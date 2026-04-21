// shared-types/assets/svg/app-render-context.svg.assets.types.ts

import type { AppContextSvgAsset } from "@shared-types/assets/svg/app-context.svg.assets.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextSvgAssetDeterministicFields = Readonly<{
  dimensions: Readonly<{
    calculated: Readonly<{
      width: number;
      height: number;
    }>;
  }>;
}>;

export type AppRenderContextSvgAsset = ReplaceAndOmit<
  AppContextSvgAsset,
  AppRenderContextSvgAssetDeterministicFields,
  never
>;

export type AppRenderContextSvgReference = Readonly<{
  id: SvgAssetId;
  width: number;
  height: number;
}>;
