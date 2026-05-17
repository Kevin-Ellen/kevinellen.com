// shared-types/assets/svg/authored.svg.assets.types.ts

import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

export type AuthoredSvgAsset = Readonly<{
  id: SvgAssetId;
  viewBox: string;
  content: string;
}>;
