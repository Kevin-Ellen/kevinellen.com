// shared-types/assets/app-context.assets.types.ts

import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AppContextSvgAsset } from "@shared-types/assets/svg/app-context.svg.assets.types";
import type { AppContextScriptAsset } from "@shared-types/assets/scripts/app-context.scripts.assets.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextAssetTypes = Readonly<{
  svg: readonly AppContextSvgAsset[];
  scripts: readonly AppContextScriptAsset[];
}>;

export type AppContextAssets = Replace<AppStateAssets, AppContextAssetTypes>;
