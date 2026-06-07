// src/app-state/resolve/structured-data.resolve.app-state.ts

import type { PageId } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";

import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type { AppStateStructuredData } from "@shared-types/config/structured-data/app-state.structured-data.types";
import type { AuthoredSocial } from "@shared-types/config/social/authored.social.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateResolveStructuredData = (
  siteConfig: AppStateSiteConfig,
  authoredSocial: AuthoredSocial,
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

    person: {
      id: {
        pageId: "about" as PageId,
        hash: "#person",
      },
      url: {
        pageId: "about" as PageId,
      },
      name: siteConfig.author,
      description: siteConfig.person.description,
      jobTitle: siteConfig.person.jobTitle,
      knowsAbout: siteConfig.person.knowsAbout,
      knowsLanguage: siteConfig.person.knowsLanguage,
      sameAs: [
        ...Object.values(authoredSocial).map((item) => item.href),
        ...siteConfig.person.additionalSameAs,
      ],
    },
  });
