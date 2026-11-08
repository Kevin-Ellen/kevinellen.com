// src/content-schema/assets/script.asset.content-schema.authored.type.ts

import type {
  ScriptLoadingType,
  ScriptLocation,
  ScriptType,
} from "./script.asset.content-schema.type";

export type ScriptAssetCommonAuthored = Readonly<{
  id: string;
  location: ScriptLocation;
  loading?: ScriptLoadingType;
  scriptType?: ScriptType;
}>;

export type InlineScriptAssetAuthored = ScriptAssetCommonAuthored &
  Readonly<{
    kind: "inline";
    content: string;
  }>;

export type StandaloneScriptAssetAuthored = ScriptAssetCommonAuthored &
  Readonly<{
    kind: "standalone";
    src: string;
  }>;

export type ScriptAssetAuthored =
  | InlineScriptAssetAuthored
  | StandaloneScriptAssetAuthored;
