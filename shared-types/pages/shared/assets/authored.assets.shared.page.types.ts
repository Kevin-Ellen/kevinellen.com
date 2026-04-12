// shared-types/pages/shared/assets/authored.assets.shared.page.types.ts

import { AuthoredScriptAssets } from "@shared-types/assets/scripts/authored.scripts.assets.types";
import { AuthoredSvgAssets } from "@shared-types/assets/svg/authored.svg.assets.types";

export type AuthoredAssets = Readonly<{
  svg?: AuthoredSvgAssets;
  scripts?: AuthoredScriptAssets;
}>;
