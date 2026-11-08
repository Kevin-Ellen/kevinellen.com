// src/app/types/primitives/assets/scripts/script.asset.app-render-context.type.ts

import type {
  InlineScriptAssetAppInit,
  StandaloneScriptAssetAppInit,
} from "../../../../../shared/types/assets/script.asset.shared.app-init.type";

export type InlineScriptAssetAppRenderContext = InlineScriptAssetAppInit;

export type StandaloneScriptAssetAppRenderContext =
  StandaloneScriptAssetAppInit;

export type ScriptAssetAppRenderContext =
  | InlineScriptAssetAppRenderContext
  | StandaloneScriptAssetAppRenderContext;
