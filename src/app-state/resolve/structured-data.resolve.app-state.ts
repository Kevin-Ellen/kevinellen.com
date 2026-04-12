// src/app-state/resolve/structured-data.resolve.app-state.ts

import type { PageId } from "@shared-types/pages/shared/id.shared.page.types";

import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type { AppStateStructuredData } from "@shared-types/config/structured-data/app-state.structured-data.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateResolveStructuredData = (
  siteConfig: AppStateSiteConfig,
): AppStateStructuredData =>
  deepFreeze({
    website: {
      id: {
        pageId: "home" as PageId,
        hash: "#website",
      },
      url: {
        pageId: "home" as PageId,
      },
      name: siteConfig.siteName,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisherId: {
        pageId: "about" as PageId,
        hash: "#person",
      },
    },
  });
