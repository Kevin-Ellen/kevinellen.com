// shared-types/page-definitions/assets/app-context.assets.page-definition.types.ts

import type { AppStateAssets } from "@shared-types/page-definitions/assets/app-state.assets.page-definition.types";
import type { AppContextSvgAsset } from "@shared-types/assets/svg/app-context.svg.assets.types";
import type { AppContextScriptAsset } from "@shared-types/assets/scripts/app-context.scripts.assets.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextAssetsDeterministicFields = Readonly<{
  svg: readonly AppContextSvgAsset[];
  scripts: readonly AppContextScriptAsset[];
}>;

export type AppContextAssets = Replace<
  AppStateAssets,
  AppContextAssetsDeterministicFields
>;
