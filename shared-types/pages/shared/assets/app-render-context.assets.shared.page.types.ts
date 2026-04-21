// shared-types/pages/shared/assets/app-render-context.assets.shared.page.types.ts

import type { AppRenderContextScriptAsset } from "@shared-types/assets/scripts/app-render-context.scripts.assets.types";
import type { AppRenderContextSvgAsset } from "@shared-types/assets/svg/app-render-context.svg.assets.types";
import type { AppRenderContextHeadLinkAsset } from "@shared-types/config/site-config/app-render-context.head-assets.config.types";

export type AppRenderContextDocOpenAssets = Readonly<{
  scripts: readonly AppRenderContextScriptAsset[];
  links: readonly AppRenderContextHeadLinkAsset[];
}>;

export type AppRenderContextDocCloseAssets = Readonly<{
  scripts: readonly AppRenderContextScriptAsset[];
  svg: readonly AppRenderContextSvgAsset[];
}>;
