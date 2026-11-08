// src/app/life-cycle/app-render-context/app-render-context.ts

import type { AppResolve } from "../app-resolve/class.app-resolve";

import { AppRenderContext } from "./class.app-render-context";
import { resolveMetadataAppRenderContext } from "./resolvers/metadata/metadata.resolver.app-render-context";
import { resolveDocumentAppRenderContext } from "./resolvers/document/document.resolver.app-render-context";

type Input = Readonly<{
  appResolve: AppResolve;
}>;

export const createAppRenderContext = ({
  appResolve,
}: Input): AppRenderContext => {
  const metadata = resolveMetadataAppRenderContext({
    status: appResolve.status,
  });

  const document = resolveDocumentAppRenderContext({
    site: appResolve.site,
    content: appResolve.content,
    scripts: appResolve.scripts,
    svgs: appResolve.svgs,
    structuredData: appResolve.structuredData,
    shell: appResolve.shell,
  });

  return new AppRenderContext({
    metadata,
    document,
  });
};
