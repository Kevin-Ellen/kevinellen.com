// src/app/life-cycle/app-render-context/resolvers/document/document.resolver.app-render-context.ts

import type { Graph } from "schema-dts";

import type { DocumentAppRenderContext } from "../../../../types/document/document.app-render-context.type";
import type { SiteConfigAppResolve } from "../../../../types/config/site.config.app-resolve.type";
import type { ContentAppResolve } from "../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { ScriptsRegistryAppResolve } from "../../../../types/registries/scripts.registry.app-resolve.type";
import type { ShellAppResolve } from "../../../../types/document/shell.document.app-resolve.type";
import type { SvgRegistryAppResolve } from "../../../../types/registries/svg.registry.app-resolve.type";

import { resolveHeadDocumentAppRenderContext } from "./head/head.document.resolver.app-render-context";
import { resolvePageDocumentAppRenderContext } from "./page/page.document.resolver.app-render-context";
import { resolveDocumentEndAppRenderContext } from "./end/end.document.resolver.app-render-context";

type Input = Readonly<{
  site: SiteConfigAppResolve;
  content: ContentAppResolve;
  scripts: ScriptsRegistryAppResolve;
  svgs: SvgRegistryAppResolve;
  structuredData: Graph["@graph"];
  shell: ShellAppResolve;
}>;

export const resolveDocumentAppRenderContext = ({
  site,
  content,
  scripts,
  svgs,
  structuredData,
  shell,
}: Input): DocumentAppRenderContext => {
  const head = resolveHeadDocumentAppRenderContext({
    site,
    content,
    scripts,
    structuredData,
  });

  const page = resolvePageDocumentAppRenderContext({
    shell,
    content,
  });

  const end = resolveDocumentEndAppRenderContext({
    scripts,
    svgs,
    content,
  });

  return {
    language: site.language,
    head,
    page,
    end,
  };
};
