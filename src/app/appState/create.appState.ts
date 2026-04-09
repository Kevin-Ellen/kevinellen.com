// src/app/appState/create.appState.ts

import { AppState } from "@app/appState/class.appState";
import type {
  AppConfig,
  AppPagesState,
  AppStateInput,
} from "@app/appState/appState.types";

import { deepFreeze } from "@utils/deepFreeze.util";

import { assetsConfig } from "@app/config/assets.config";
import { footerConfig } from "@app/config/footer.config";
import { GONE_RULES } from "@app/config/gone.config";
import { navigationConfig } from "@app/config/navigation.config";
import { REDIRECTS } from "@app/config/redirects.config";
import { siteConfig } from "@app/config/site.config";
import { socialConfig } from "@app/config/social.config";
import { structuredDataConfig } from "@app/config/structured-data.config";
import { webManifestConfig } from "@app/config/webmanifest.config";
import { photoMetadataConfig } from "@app/config/metadata.photo.config";

import { PAGE_REGISTRY } from "@app/content/pages/registry.pages";

const createUniqueMap = <K, V>(
  items: readonly V[],
  getKey: (item: V) => K,
  label: string,
): ReadonlyMap<K, V> => {
  const map = new Map<K, V>();

  for (const item of items) {
    const key = getKey(item);

    if (map.has(key)) {
      throw new Error(`Duplicate ${label}: ${String(key)}`);
    }

    map.set(key, item);
  }

  return map;
};

export const createAppState = (): AppState => {
  const config: AppConfig = deepFreeze({
    assets: assetsConfig,
    footer: footerConfig,
    gone: GONE_RULES,
    navigation: navigationConfig,
    redirects: REDIRECTS,
    site: siteConfig,
    social: socialConfig,
    structuredData: structuredDataConfig,
    webManifest: webManifestConfig,
    photoMetadata: photoMetadataConfig,
  });

  const pages: AppPagesState = {
    public: PAGE_REGISTRY.public,
    error: PAGE_REGISTRY.error,
    publicById: createUniqueMap(
      PAGE_REGISTRY.public,
      (page) => page.core.id,
      "public page id",
    ),
    publicBySlug: createUniqueMap(
      PAGE_REGISTRY.public,
      (page) => page.core.slug,
      "public page slug",
    ),
    errorByStatus: createUniqueMap(
      PAGE_REGISTRY.error,
      (page) => page.core.status,
      "error page status",
    ),
  };

  const appInput: AppStateInput = deepFreeze({
    config,
    pages,
  });

  return new AppState(appInput);
};
