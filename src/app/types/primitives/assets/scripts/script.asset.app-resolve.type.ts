// src/app/types/primitives/assets/scripts/script.asset.app-resolve.type.ts

import type {
  InlineScriptAssetAppInit,
  StandaloneScriptAssetAppInit,
} from "../../../../../shared/types/assets/script.asset.shared.app-init.type";

export type InlineScriptAssetAppResolve = InlineScriptAssetAppInit;

export type StandaloneScriptAssetAppResolve = StandaloneScriptAssetAppInit;

export type ScriptAssetAppResolve =
  | InlineScriptAssetAppResolve
  | StandaloneScriptAssetAppResolve;
