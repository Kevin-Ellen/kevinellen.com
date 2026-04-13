// packages/shared-types/src/assets/svg.asset.authored.types.ts

import type { SvgAssetId } from "@shared-types/assets/id.asset.types";

export type SvgAssetAuthored = {
  id: SvgAssetId;
  viewBox: string;
  content: string;
};
