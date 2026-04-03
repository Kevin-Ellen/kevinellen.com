// src/app/appContext/class.appContext.ts

import type {
  AppContextAssets,
  AppContextBreadcrumb,
  AppContextCanonicalUrl,
  AppContextConfig,
  AppContextContent,
  AppContextNavigation,
  AppContextStructuredData,
} from "@app/appContext/appContext.types";
import type { SiteConfig } from "@config/site.config.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

export class AppContext {
  private readonly request: Request;
  private readonly siteConfig: SiteConfig;
  private readonly canonicalUrl: AppContextCanonicalUrl;
  private readonly target: DocumentRenderTarget;
  private readonly breadcrumbs: readonly AppContextBreadcrumb[];
  private readonly navigation: AppContextNavigation;
  private readonly assets: AppContextAssets;
  private readonly structuredData: AppContextStructuredData;
  private readonly content: AppContextContent;

  public constructor(config: AppContextConfig) {
    this.request = config.request;
    this.siteConfig = config.siteConfig;
    this.canonicalUrl = config.canonicalUrl;
    this.target = config.target;
    this.breadcrumbs = config.breadcrumbs;
    this.navigation = config.navigation;
    this.assets = config.assets;
    this.structuredData = config.structuredData;
    this.content = config.content;

    Object.freeze(this);
  }

  public getRequest(): Request {
    return this.request;
  }

  public getSiteConfig(): SiteConfig {
    return this.siteConfig;
  }

  public getCanonicalUrl(): AppContextCanonicalUrl {
    return this.canonicalUrl;
  }

  public getTarget(): DocumentRenderTarget {
    return this.target;
  }

  public getBreadcrumbs(): readonly AppContextBreadcrumb[] {
    return this.breadcrumbs;
  }

  public getNavigation(): AppContextNavigation {
    return this.navigation;
  }

  public getAssets(): AppContextAssets {
    return this.assets;
  }

  public getStructuredData(): AppContextStructuredData {
    return this.structuredData;
  }

  public getContent(): AppContextContent {
    return this.content;
  }
}
