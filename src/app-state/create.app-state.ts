// src/app-state.create.app-state.ts

import { AppState } from "@app-state/class.app-state";

import { appStateResolveSiteConfig } from "@app-state/resolve/site-config.resolve.app-state";
import { appStateResolveWebmanifest } from "@app-state/resolve/webmanifest.resolve.app-state";
import { appStateResolveSystem } from "@app-state/resolve/system.resolve.app-state";
import { appStateResolveAssets } from "@app-state/resolve/assets.resolve.app-state";
import { appStateResolveGlobalFooter } from "@app-state/resolve/page-content/global-footer.resolve.app-state";
import { appStateResolveSocial } from "@app-state/resolve/social.resolve.app-state";
import { appStateResolveMetadataLabels } from "@app-state/resolve/metadata-labels.resolve.app-state";
import { appStateResolveNavigation } from "@app-state/resolve/navigation.resolve.app-state";
import { appStateResolveStructuredData } from "@app-state/resolve/structured-data.resolve.app-state";
import { appStateResolvePages } from "./resolve/pages.resolve.app-state";

export const appStateCreate = async (env: Env): Promise<AppState> => {
  const siteConfig = appStateResolveSiteConfig(env);
  const webManifest = appStateResolveWebmanifest(siteConfig);

  const system = appStateResolveSystem;
  const assets = appStateResolveAssets;

  const globalFooter = appStateResolveGlobalFooter(siteConfig);
  const social = appStateResolveSocial;
  const metadataLabels = appStateResolveMetadataLabels;
  const navigation = appStateResolveNavigation;
  const structuredData = appStateResolveStructuredData(siteConfig);

  const pages = await appStateResolvePages({
    kv: env.KV_JOURNALS,
  });

  return new AppState({
    siteConfig,
    webManifest,
    system,
    assets,
    globalFooter,
    social,
    metadataLabels,
    navigation,
    structuredData,
    pages,
  });
};
