// src/app/appState/class.appState.ts

import type {
  AppStateConfig,
  AppStatePages,
  AppStateErrorPages,
  AppStatePublicPages,
  AppStatePageIndices,
} from "@app/appState/appState.types";

import type { SiteConfig } from "@config/site.config.types";
import type { AssetsConfig } from "@config/assets.config.types";
import type { FooterConfig } from "@config/footer.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";
import type { SocialConfig } from "@config/social.config.types";
import type { StructuredDataConfig } from "@config/structured-data.config.types";
import type { WebManifestConfig } from "@config/webmanifest.config.types";
import type {
  PageId,
  PageDefinition,
  ErrorPageDefinition,
  ErrorPageStatus,
} from "@app/pages/page.definition";

export class AppState {
  private readonly siteConfig: SiteConfig;
  private readonly assetsConfig: AssetsConfig;
  private readonly footerConfig: FooterConfig;
  private readonly navigationConfig: NavigationConfig;
  private readonly socialConfig: SocialConfig;
  private readonly structuredDataConfig: StructuredDataConfig;
  private readonly webManifestConfig: WebManifestConfig;
  private readonly pages: AppStatePages;
  private readonly pageIndices: AppStatePageIndices;

  public constructor(state: AppStateConfig) {
    this.siteConfig = state.siteConfig;
    this.assetsConfig = state.assetsConfig;
    this.footerConfig = state.footerConfig;
    this.navigationConfig = state.navigationConfig;
    this.socialConfig = state.socialConfig;
    this.structuredDataConfig = state.structuredDataConfig;
    this.webManifestConfig = state.webManifestConfig;
    this.pages = state.pages;

    this.pageIndices = this.createPageIndices(state.pages);

    Object.freeze(this);
  }

  private createPageIndices(pages: AppStatePages): AppStatePageIndices {
    const publicById = new Map<PageId, PageDefinition>();
    const publicBySlug = new Map<string, PageDefinition>();

    for (const page of pages.publicPages) {
      if (publicById.has(page.core.id)) {
        throw new Error(`Duplicate public page id: ${page.core.id}`);
      }

      if (publicBySlug.has(page.core.slug)) {
        throw new Error(`Duplicate public page slug: ${page.core.slug}`);
      }

      publicById.set(page.core.id, page);
      publicBySlug.set(page.core.slug, page);
    }

    const errorById = new Map<PageId, ErrorPageDefinition>();
    const errorByStatus = new Map<ErrorPageStatus, ErrorPageDefinition>();

    for (const page of pages.errorPages) {
      if (errorById.has(page.core.id)) {
        throw new Error(`Duplicate error page id: ${page.core.id}`);
      }

      if (errorByStatus.has(page.core.status)) {
        throw new Error(`Duplicate error page status: ${page.core.status}`);
      }

      errorById.set(page.core.id, page);
      errorByStatus.set(page.core.status, page);
    }

    return {
      publicPages: Object.freeze({
        byId: publicById,
        bySlug: publicBySlug,
      }),
      errorPages: Object.freeze({
        byId: errorById,
        byStatus: errorByStatus,
      }),
    };
  }

  public getSiteConfig(): SiteConfig {
    return this.siteConfig;
  }

  public getAssetsConfig(): AssetsConfig {
    return this.assetsConfig;
  }

  public getFooterConfig(): FooterConfig {
    return this.footerConfig;
  }

  public getNavigationConfig(): NavigationConfig {
    return this.navigationConfig;
  }

  public getSocialConfig(): SocialConfig {
    return this.socialConfig;
  }

  public getStructuredDataConfig(): StructuredDataConfig {
    return this.structuredDataConfig;
  }

  public getWebManifestConfig(): WebManifestConfig {
    return this.webManifestConfig;
  }

  public getPublicPages(): AppStatePublicPages {
    return this.pages.publicPages;
  }

  public getErrorPages(): AppStateErrorPages {
    return this.pages.errorPages;
  }

  public getPublicPageById(id: PageId): PageDefinition | null {
    return this.pageIndices.publicPages.byId.get(id) ?? null;
  }

  public getPageBySlug(slug: string): PageDefinition | null {
    return this.pageIndices.publicPages.bySlug.get(slug) ?? null;
  }

  public getErrorPageById(id: PageId): ErrorPageDefinition | null {
    return this.pageIndices.errorPages.byId.get(id) ?? null;
  }

  public getErrorPageByStatus(
    status: ErrorPageStatus,
  ): ErrorPageDefinition | null {
    return this.pageIndices.errorPages.byStatus.get(status) ?? null;
  }
}
