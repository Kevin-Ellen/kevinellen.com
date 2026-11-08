// src/app/life-cycle/app-render-context/resolvers/document/head/head.document.resolver.app-render-context.ts

import type { SiteConfigAppResolve } from "../../../../../types/config/site.config.app-resolve.type";
import type { ContentAppResolve } from "../../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { HeadDocumentAppRenderContext } from "../../../../../types/document/head.document.app-render-context.type";
import type { ScriptsRegistryAppResolve } from "../../../../../types/registries/scripts.registry.app-resolve.type";
import type { ScriptAssetId } from "../../../../../../shared/types/assets/script-id.asset.shared.type";
import type { ScriptAssetAppResolve } from "../../../../../types/primitives/assets/scripts/script.asset.app-resolve.type";
import type { StructuredDataRegistryAppResolve } from "../../../../../types/registries/structured-data.registry.app-resolve.type";

type Input = Readonly<{
  site: SiteConfigAppResolve;
  content: ContentAppResolve;
  scripts: ScriptsRegistryAppResolve;
  structuredData: StructuredDataRegistryAppResolve;
}>;

type ScriptsResolverInput = Readonly<{
  scripts: ScriptsRegistryAppResolve;
  pageScripts: readonly ScriptAssetId[];
}>;

const resolveHeadScriptsDocumentAppRenderContext = ({
  scripts,
  pageScripts,
}: ScriptsResolverInput): readonly ScriptAssetAppResolve[] => {
  const ids = new Set([...scripts.global, ...pageScripts]);

  return [...ids].flatMap((id) => {
    const script = scripts.registry[id];

    return script?.location === "head" ? [script] : [];
  });
};
export const resolveHeadDocumentAppRenderContext = ({
  site,
  content,
  scripts,
  structuredData,
}: Input): HeadDocumentAppRenderContext => ({
  title: content.metadata.title,
  description: content.metadata.description,
  canonical: content.slug
    ? new URL(content.slug, site.canonicalDomain).href
    : null,

  locale: site.locale,
  themeColor: site.themeColor,
  icons: site.icons,
  manifest: site.manifest,

  structuredData,

  scripts: resolveHeadScriptsDocumentAppRenderContext({
    scripts,
    pageScripts: content.scripts,
  }),
});
