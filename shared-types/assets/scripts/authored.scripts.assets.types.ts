// shared-types/assets/scripts/authored.scripts.assets.ts

import type { ScriptAssetId } from "@shared-types/assets/scripts/id.scripts.assets.types";
import type { ScriptAssetLoading } from "@shared-types/assets/scripts/shared.scripts.assets.types";

export type AuthoredExternalScriptAsset = Readonly<
  {
    kind: "external";
    src: string;
    id: ScriptAssetId;
    location: "header" | "footer";
  } & ScriptAssetLoading
>;

export type AuthoredInternalScriptAsset = Readonly<{
  kind: "inline";
  content: string;
  id: ScriptAssetId;
  location: "header" | "footer";
}>;

export type AuthoredScriptAsset =
  | AuthoredExternalScriptAsset
  | AuthoredInternalScriptAsset;
