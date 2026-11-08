// src/app/life-cycle/app-render-context/resolvers/document/end/end.document.resolver.app-render-context.ts

import type { EndDocumentAppRenderContext } from "../../../../../types/document/end.document.app-render-context.type";
import type { ContentAppResolve } from "../../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { ScriptsRegistryAppResolve } from "../../../../../types/registries/scripts.registry.app-resolve.type";
import type { SvgRegistryAppResolve } from "../../../../../types/registries/svg.registry.app-resolve.type";

type Input = Readonly<{
  scripts: ScriptsRegistryAppResolve;
  svgs: SvgRegistryAppResolve;
  content: ContentAppResolve;
}>;

export const resolveDocumentEndAppRenderContext = ({
  scripts,
  svgs,
  content,
}: Input): EndDocumentAppRenderContext => {
  const selectedIds = new Set([...scripts.global, ...content.scripts]);

  const selectedScripts = [...selectedIds].map((id) => {
    const script = scripts.registry[id];

    if (!script) {
      throw new Error(`Unknown script: ${id}`);
    }

    return script;
  });

  return {
    svg: Object.values(svgs),
    scripts: selectedScripts.filter((script) => script.location === "end"),
  };
};
