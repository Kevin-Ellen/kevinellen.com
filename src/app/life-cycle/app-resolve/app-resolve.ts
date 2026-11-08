// src/app/life-cycle/app-resolve/app-resolve.ts

import type { AppInit } from "../app-init/class.app-init";
import type { ValidatedEnv } from "../../entry.type";
import type { RoutingResult } from "../../types/routing/routing.shared.type";
import type { PublishedRegistry } from "../../../shared/types/content/kv-ledger.content.shared.type";

import { AppResolve } from "./class.app-resolve";

import { resolveSiteConfigAppResolve } from "./resolvers/site/site.config.resolver.app-resolve";
import { resolveContentRegistryAppResolve } from "./resolvers/registry/content/content.registry.resolver.app-resolve";
import { resolveScriptsRegistryAppResolve } from "./resolvers/registry/scripts/scripts.registry.resolver.app-resolve";
import { resolveSvgRegistryAppResolve } from "./resolvers/registry/svg/svg.registry.resolver.app-resolve";
import { resolveShellAppResolve } from "./resolvers/shell/shell.resolver.app-resolve";
import { resolveContentAppResolve } from "./resolvers/content/content.resolver.app-resolve";
import { resolveStructuredDataRegistryAppResolve } from "./resolvers/registry/structured-data/structured-data.registry.resolver.app-resolve";

import { getContentAppResolve } from "./getters/content/content.getter.app-resolve";
import { createPhotoGetter } from "./getters/photo-kv/photo-kv.getter.app-resolve";

type ContentRoutingResult = Extract<
  RoutingResult<PublishedRegistry>,
  { kind: "selected" | "not-found" }
>;

type Input = Readonly<{
  appInit: AppInit;
  routing: ContentRoutingResult;
  env: ValidatedEnv;
}>;

export const createAppResolve = async ({
  appInit,
  routing,
  env,
}: Input): Promise<AppResolve> => {
  const site = resolveSiteConfigAppResolve({
    appInit: appInit.site,
  });

  const contentRegistry = resolveContentRegistryAppResolve({
    appInit,
    ledger: routing.ledger,
  });

  const selectedContent = await getContentAppResolve({
    appInit,
    routing,
    env,
    contentRegistry,
  });

  const requestedPage =
    routing.kind === "selected" ? (routing.pagination?.page ?? 1) : 1;

  const getPhoto = createPhotoGetter(env.PHOTO_KV);

  const content = await resolveContentAppResolve({
    content: selectedContent,
    contentRegistry,
    getPhoto,
    person: appInit.person,
    site: appInit.site,
    journalLedger: routing.ledger,
    requestedPage,
  });

  const registries = {
    content: contentRegistry,
    scripts: resolveScriptsRegistryAppResolve({ appInit }),
    svg: resolveSvgRegistryAppResolve({ appInit }),
    structuredData: resolveStructuredDataRegistryAppResolve({
      person: appInit.person,
      site: appInit.site,
      resolvedSite: site,
      content,
    }),
  };

  const shell = resolveShellAppResolve({
    appInit,
    contentRegistry: registries.content,
    pagePresentation: content.pagePresentation,
  });

  return new AppResolve({
    site,
    registries,
    shell,
    content,
  });
};
