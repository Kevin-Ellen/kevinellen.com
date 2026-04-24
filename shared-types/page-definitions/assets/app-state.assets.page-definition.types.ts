// shared-types/page-definitions/assets/app-state.assets.page-definition.types.ts

import type { AuthoredAssets } from "@shared-types/page-definitions/assets/authored.assets.page-definition.types";
import type { AppStateSvgAsset } from "@shared-types/assets/svg/app-state.svg.assets.types";
import type { AppStateScriptAsset } from "@shared-types/assets/scripts/app-state.scripts.assets.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateAssetsDeterministicFields = Readonly<{
  svg: readonly AppStateSvgAsset[];
  scripts: readonly AppStateScriptAsset[];
}>;

export type AppStateAssets = Replace<
  AuthoredAssets,
  AppStateAssetsDeterministicFields
>;
