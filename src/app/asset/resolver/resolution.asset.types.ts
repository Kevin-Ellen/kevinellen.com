// src/app/policies/asset/resolution.asset.types.ts

import type { AssetRequest } from "@app/asset/request/request.asset.types";

export type AssetResolution =
  | {
      outcome: "asset";
      asset: AssetRequest;
    }
  | {
      outcome: "not-asset";
    }
  | {
      outcome: "unsupported-asset";
      pathname: string;
    };
