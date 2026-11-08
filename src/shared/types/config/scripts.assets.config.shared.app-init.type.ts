// src/shared/types/config/scripts.assets.config.shared.app-init.type.ts

import type { ScriptsAssetsConfigAuthored } from "../assets/scripts.assets.config.authored.type";
import type { ScriptAssetAppInit } from "../assets/script.asset.shared.app-init.type";
import type { ScriptAssetId } from "../assets/script-id.asset.shared.type";
import type { OmitAndReplace } from "../utilities/omit-replace.utility.shared.type";

export type ScriptsAssetsConfigAppInit = Readonly<
  OmitAndReplace<
    ScriptsAssetsConfigAuthored,
    {
      registry: Readonly<Record<ScriptAssetId, ScriptAssetAppInit>>;
      global: readonly ScriptAssetId[];
    }
  >
>;
