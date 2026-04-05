// src/app/appContext/class.appContext.ts

import type { SiteConfig } from "@config/site.config.types";
import type {
  AppContextBreadcrumb,
  AppContextInput,
  AppContextInspect,
  AppContextMetadata,
  AppContextNavigation,
  AppContextPage,
  AppContextRequest,
} from "@app/appContext/appContext.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

export class AppContext {
  readonly #request: AppContextRequest;
  readonly #site: SiteConfig;
  readonly #target: DocumentRenderTarget;
  readonly #page: AppContextPage;
  readonly #metadata: AppContextMetadata;
  readonly #breadcrumbs: readonly AppContextBreadcrumb[];
  readonly #navigation: AppContextNavigation;

  public constructor(input: AppContextInput) {
    this.#request = input.request;
    this.#site = input.site;
    this.#target = input.target;
    this.#page = input.page;
    this.#metadata = input.metadata;
    this.#breadcrumbs = input.breadcrumbs;
    this.#navigation = input.navigation;
  }

  public get request(): AppContextRequest {
    return this.#request;
  }

  public get site(): SiteConfig {
    return this.#site;
  }

  public get target(): DocumentRenderTarget {
    return this.#target;
  }

  public get page(): AppContextPage {
    return this.#page;
  }

  public get metadata(): AppContextMetadata {
    return this.#metadata;
  }

  public get breadcrumbs(): readonly AppContextBreadcrumb[] {
    return this.#breadcrumbs;
  }

  public get navigation(): AppContextNavigation {
    return this.#navigation;
  }

  public inspect(): AppContextInspect {
    return {
      request: this.#request,
      site: {
        siteName: this.#site.siteName,
        siteUrl: this.#site.siteUrl,
        language: this.#site.language,
        headerBranding: this.#site.headerBranding,
      },
      target: {
        kind: this.#target.kind,
        status: this.#target.status,
        page: {
          id: this.#target.page.core.id,
          kind: this.#target.page.core.kind,
          label: this.#target.page.core.label,
        },
      },
      page: {
        id: this.#page.core.id,
        kind: this.#page.core.kind,
        label: this.#page.core.label,
      },
      metadata: this.#metadata,
      breadcrumbs: this.#breadcrumbs,
      navigation: this.#navigation,
    };
  }
}
