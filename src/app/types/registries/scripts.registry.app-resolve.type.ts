// src/app/types/registries/scripts.registry.app-resolve.type.ts

import type { ScriptsAssetsConfigAppInit } from "../../../shared/types/config/scripts.assets.config.shared.app-init.type";
import type { ScriptAssetAppResolve } from "../primitives/assets/scripts/script.asset.app-resolve.type";
import type { ScriptAssetId } from "../../../shared/types/assets/script-id.asset.shared.type";
import type { OmitAndReplace } from "../../../shared/types/utilities/omit-replace.utility.shared.type";

export type ScriptsRegistryAppResolve = Readonly<
  OmitAndReplace<
    ScriptsAssetsConfigAppInit,
    {
      registry: Readonly<Record<ScriptAssetId, ScriptAssetAppResolve>>;
    }
  >
>;
