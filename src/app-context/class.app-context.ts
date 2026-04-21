// src/app-context/class.app-context.ts

import type { AppContextData } from "@app-context/app-context.types";
import type { AppContextNavigation } from "@shared-types/config/navigation/app-context.navigation.types";
import type { AppContextGlobalFooter } from "@shared-types/page-content/site/global-footer/app-context.global-footer.page-content.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { PageMetadata } from "@shared-types/pages/shared/metadata.shared.page.types";
import type { AppStatePageRobotsDirectives } from "@shared-types/pages/shared/app-state.robots.shared.page.types";
import type { SiteLanguage } from "@shared-types/language/language.types";
import type { AppContextAssets } from "@shared-types/assets/app-context.assets.types";
import type { AppContextHeadAssets } from "@shared-types/config/site-config/app-context.head-assets.config.types";
import type { AppContextThemeColour } from "@shared-types/config/webmanifest/app-context.theme-colour.webmanifest.types";
import type { AppContextHeaderBranding } from "@shared-types/config/site-config/app-context.header-branding.config.types";
import type { AppContextBreadcrumbs } from "@shared-types/breadcrumbs/app-context.breadcrumbs.types";

export class AppContext {
  readonly #data: AppContextData;

  readonly #navigation: AppContextNavigation;
  readonly #globalFooter: AppContextGlobalFooter;
  readonly #structuredData: readonly AppContextStructuredDataEntry[];

  readonly #metadata: PageMetadata | null;
  readonly #robots: AppStatePageRobotsDirectives | null;
  readonly #language: SiteLanguage;
  readonly #canonicalUrl: string | null;

  public constructor(data: AppContextData) {
    this.#data = data;
    this.#navigation = data.navigation;
    this.#globalFooter = data.globalFooter;
    this.#structuredData = data.structuredData;

    this.#metadata = data.metadata ?? null;
    this.#robots = data.robots ?? null;
    this.#language = data.language;
    this.#canonicalUrl = data.canonicalUrl;
  }

  public get metadata(): PageMetadata | null {
    return this.#metadata;
  }

  public get robots(): AppStatePageRobotsDirectives | null {
    return this.#robots;
  }

  public get language(): SiteLanguage {
    return this.#language;
  }

  public get navigation(): AppContextNavigation {
    return this.#navigation;
  }

  public get globalFooter(): AppContextGlobalFooter {
    return this.#globalFooter;
  }

  public get structuredData(): readonly AppContextStructuredDataEntry[] {
    return this.#structuredData;
  }

  public get canonicalUrl(): string | null {
    return this.#canonicalUrl;
  }

  public get assets(): AppContextAssets {
    return this.#data.assets;
  }

  public get headAssets(): AppContextHeadAssets {
    return this.#data.headAssets;
  }

  public get themeColour(): AppContextThemeColour {
    return this.#data.themeColour;
  }

  public get headerBranding(): AppContextHeaderBranding {
    return this.#data.headerBranding;
  }

  public get breadcrumbs(): AppContextBreadcrumbs {
    return this.#data.breadcrumbs;
  }

  public get inspect(): AppContextData {
    return this.#data;
  }
}
