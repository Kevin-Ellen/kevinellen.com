// src/app/life-cycle/app-resolve/resolvers/site/site.config.resolver.app-resolve.ts

import type { SiteConfigAppInit } from "../../../../../shared/types/config/site.config.shared.app-init.type";
import type { SiteConfigAppResolve } from "../../../../types/config/site.config.app-resolve.type";

type Input = Readonly<{
  appInit: SiteConfigAppInit;
}>;

export const resolveSiteConfigAppResolve = ({
  appInit,
}: Input): SiteConfigAppResolve => {
  const {
    titleSuffix: _titleSuffix,
    description: _description,
    name: _name,
    ...resolved
  } = appInit;

  return {
    ...resolved,
    manifest: new URL(appInit.manifest, appInit.canonicalDomain).href,
  };
};
