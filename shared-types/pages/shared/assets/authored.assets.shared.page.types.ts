// shared-types/pages/shared/assets/authored.assets.shared.page.types.ts

import type { AuthoredSvgAsset } from "@shared-types/assets/svg/authored.svg.assets.types";
import type { AuthoredScriptAsset } from "@shared-types/assets/scripts/authored.scripts.assets.types";

export type AuthoredAssets = Readonly<{
  svg?: readonly AuthoredSvgAsset[];
  scripts?: readonly AuthoredScriptAsset[];
}>;
