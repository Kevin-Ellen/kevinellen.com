// src/app/types/document/head.document.app-render-context.type.ts

import type { Graph } from "schema-dts";

import type { SiteConfigAppResolve } from "../config/site.config.app-resolve.type";
import type { ScriptAssetAppRenderContext } from "../primitives/assets/scripts/script.asset.app-render-context.type";

export type HeadDocumentAppRenderContext = Readonly<{
  title: string;
  description: string;
  canonical: string | null;

  locale: SiteConfigAppResolve["locale"];
  themeColor: SiteConfigAppResolve["themeColor"];
  icons: SiteConfigAppResolve["icons"];
  manifest: SiteConfigAppResolve["manifest"];

  structuredData: Graph["@graph"];
  scripts: readonly ScriptAssetAppRenderContext[];
}>;
