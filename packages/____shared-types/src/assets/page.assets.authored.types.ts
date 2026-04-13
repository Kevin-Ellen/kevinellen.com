// packages/shared-types/src/assets/page.assets.authored.types.ts
import type {
  ScriptAssetId,
  SvgAssetId,
} from "@shared-types/assets/id.asset.types";

export type PageAssetsAuthored = {
  scripts: readonly ScriptAssetId[];
  svgs: readonly SvgAssetId[];
};
