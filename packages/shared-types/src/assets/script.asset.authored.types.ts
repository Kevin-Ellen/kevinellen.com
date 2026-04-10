// packages/shared-types/src/assets/script.asset.authored.types.ts

import type { ScriptAssetId } from "@shared-types/assets/id.asset.types";

type ScriptAssetLoading =
  | { loading?: undefined }
  | { loading: "defer" }
  | { loading: "async" };

export type ScriptAssetAuthored =
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
