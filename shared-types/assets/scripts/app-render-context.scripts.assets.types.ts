// shared-types/assets/scripts/app-render-context.scripts.assets.types.ts

import type { ScriptAssetLoading } from "@shared-types/assets/scripts/shared.scripts.assets.types";

export type AppRenderContextInlineScript = Readonly<{
  content: string;
  nonce: string;
}>;

export type AppRenderContextLinkScript = Readonly<
  {
    src: string;
    nonce: string;
  } & ScriptAssetLoading
>;
