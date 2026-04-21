// shared-types/assets/scripts/app-render-context.scripts.assets.types.ts

import type { AppStateScriptAsset } from "@shared-types/assets/scripts/app-state.scripts.assets.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextScriptSharedFields = Readonly<{
  nonce: string;
}>;

export type AppRenderContextExternalScriptAsset = ReplaceAndOmit<
  Extract<AppStateScriptAsset, { kind: "external" }>,
  AppRenderContextScriptSharedFields,
  "location"
>;

export type AppRenderContextInlineScriptAsset = ReplaceAndOmit<
  Extract<AppStateScriptAsset, { kind: "inline" }>,
  AppRenderContextScriptSharedFields,
  "location"
>;

export type AppRenderContextScriptAsset =
  | AppRenderContextExternalScriptAsset
  | AppRenderContextInlineScriptAsset;
