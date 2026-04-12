// shared-types/assets/scripts/authored.scripts.assets.ts

import type { ScriptAssetId } from "@shared-types/assets/scripts/id.scripts.assets.types";

type ScriptAssetLoading =
  | { loading?: undefined }
  | { loading: "defer" }
  | { loading: "async" };

export type AuthoredScriptAsset =
  | ({
      kind: "external";
      src: string;
    } & ScriptAssetLoading & {
        id: ScriptAssetId;
        location: "header" | "footer";
      })
  | {
      kind: "inline";
      content: string;
      id: ScriptAssetId;
      location: "header" | "footer";
    };

export type AuthoredScriptAssets = readonly AuthoredScriptAsset[];
