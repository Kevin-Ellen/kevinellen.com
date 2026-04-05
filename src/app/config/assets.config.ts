// src/app/config/assets.config.ts

import type { AssetsConfig } from "@config/assets.config.types";

import { deepFreeze } from "@utils/deepFreeze.util";
import { appSvgs } from "@config/svgs.assets.config";
import { appScripts } from "@config/scripts.assets.config";

export const assetsConfig: AssetsConfig = deepFreeze({
  svgs: appSvgs,
  scripts: appScripts,
});
