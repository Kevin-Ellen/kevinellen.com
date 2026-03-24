// src/app/appState/appState.app.ts

import type {
  AppStateSeed,
  AppStateData,
  AppPagesSeed,
  AppPagesState,
} from "@app/appState/appState.types";

import { deepFreeze } from "@utils/deepFreeze.util";

import type { SiteConfig } from "@config/site.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";
import type { SocialConfig } from "@config/social.config.types";
import type { StructuredDataConfig } from "@config/structured-data.config.types";
import type { AssetsConfig } from "@config/assets.config.types";
import type { FooterConfig } from "@config/footer.config.types";
import type { WebManifestConfig } from "@config/webmanifest.config.types";
import type {
  PageId,
  PageDefinition,
  ErrorPageStatus,
  ErrorPageDefinition,
} from "@app/pages/page.definition";

export class AppState {
  private readonly data: AppStateData;

  public constructor(seed: AppStateSeed) {
    this.data = deepFreeze({
      site: seed.site,
      navigation: seed.navigation,
      social: seed.social,
      structuredData: seed.structuredData,
      assets: seed.assets,
      footer: seed.footer,
      webmanifest: seed.webmanifest,
      pages: this.buildAppPagesState(seed.pages),
    });
  }

  private buildAppPagesState(pages: AppPagesSeed): AppPagesState {
    const publicAll = [...pages.public];
    const errorAll = [...pages.error];

    const publicById = new Map<PageId, PageDefinition>();
    const publicBySlug = new Map<string, PageDefinition>();
    const errorByStatus = new Map<ErrorPageStatus, ErrorPageDefinition>();

    for (const page of publicAll) {
      const pageId = page.core.id;
      const pageSlug = page.core.slug;

      if (publicById.has(pageId)) {
        throw new Error(`Duplicate page id detected: ${pageId}`);
      }

      if (publicBySlug.has(pageSlug)) {
        throw new Error(`Duplicate page slug detected: ${pageSlug}`);
      }

      publicById.set(pageId, page);
      publicBySlug.set(pageSlug, page);
    }

    for (const page of errorAll) {
      const status = page.core.status;

      if (errorByStatus.has(status)) {
        throw new Error(`Duplicate error page status detected: ${status}`);
      }

      errorByStatus.set(status, page);
    }

    return deepFreeze({
      public: {
        all: publicAll,
        byId: publicById,
        bySlug: publicBySlug,
      },
      error: {
        all: errorAll,
        byStatus: errorByStatus,
      },
    });
  }

  private serialiseMap<TKey extends string | number, TValue>(
    map: ReadonlyMap<TKey, TValue>,
  ): Record<string, TValue> {
    return Object.fromEntries(map.entries()) as Record<string, TValue>;
  }

  public getSiteConfig(): SiteConfig {
    return this.data.site;
  }

  public getNavigationConfig(): NavigationConfig {
    return this.data.navigation;
  }

  public getSocialConfig(): SocialConfig {
    return this.data.social;
  }

  public getStructuredDataConfig(): StructuredDataConfig {
    return this.data.structuredData;
  }

  public getAssetsConfig(): AssetsConfig {
    return this.data.assets;
  }

  public getFooterConfig(): FooterConfig {
    return this.data.footer;
  }

  public getWebManifestConfig(): WebManifestConfig {
    return this.data.webmanifest;
  }

  public getPageById(id: PageId): PageDefinition | null {
    return this.data.pages.public.byId.get(id) ?? null;
  }

  public getPageBySlug(slug: string): PageDefinition | null {
    return this.data.pages.public.bySlug.get(slug) ?? null;
  }

  public getErrorPageByStatus(
    status: ErrorPageStatus,
  ): ErrorPageDefinition | null {
    return this.data.pages.error.byStatus.get(status) ?? null;
  }

  public toJSON(): Record<string, unknown> {
    return {
      site: this.data.site,
      navigation: this.data.navigation,
      social: this.data.social,
      structuredData: this.data.structuredData,
      assets: this.data.assets,
      footer: this.data.footer,
      webmanifest: this.data.webmanifest,
      pages: {
        public: {
          all: this.data.pages.public.all,
          byId: this.serialiseMap(this.data.pages.public.byId),
          bySlug: this.serialiseMap(this.data.pages.public.bySlug),
        },
        error: {
          all: this.data.pages.error.all,
          byStatus: this.serialiseMap(this.data.pages.error.byStatus),
        },
      },
    };
  }
}
