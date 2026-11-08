// src/app/types/document/end.document.app-render-context.type.ts

import type { ScriptAssetAppRenderContext } from "../primitives/assets/scripts/script.asset.app-render-context.type";
import type { SvgAssetAppRenderContext } from "../primitives/assets/svg/svg.asset.app-render-context.type";

export type EndDocumentAppRenderContext = Readonly<{
  svg: readonly SvgAssetAppRenderContext[];
  scripts: readonly ScriptAssetAppRenderContext[];
}>;
