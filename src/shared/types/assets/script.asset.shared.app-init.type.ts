// src/shared/types/assets/script.asset.shared.app-init.type.ts

import type {
  InlineScriptAssetAuthored,
  StandaloneScriptAssetAuthored,
} from "../../../content-schema/assets/script.asset.content-schema.authored.type";

import type {
  ScriptLoadingType,
  ScriptLocation,
  ScriptType,
} from "../../../content-schema/assets/script.asset.content-schema.type";

import type { ScriptAssetId } from "./script-id.asset.shared.type";
import type { OmitAndReplace } from "../utilities/omit-replace.utility.shared.type";

export type ScriptAssetCommonAppInit = Readonly<{
  id: ScriptAssetId;
  location: ScriptLocation;
  loading: ScriptLoadingType | null;
  scriptType: ScriptType;
}>;

export type InlineScriptAssetAppInit = Readonly<
  OmitAndReplace<InlineScriptAssetAuthored, ScriptAssetCommonAppInit>
>;

export type StandaloneScriptAssetAppInit = Readonly<
  OmitAndReplace<StandaloneScriptAssetAuthored, ScriptAssetCommonAppInit>
>;

export type ScriptAssetAppInit =
  | InlineScriptAssetAppInit
  | StandaloneScriptAssetAppInit;
