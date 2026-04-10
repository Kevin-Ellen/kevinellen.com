// src/app/appState/class.appState.ts

import type {
  AppConfig,
  AppPagesState,
  AppStateInput,
} from "@app/appState/appState.types";

import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPageStatus } from "@shared-types/content/pages/error/error.page.definition";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetAuthored } from "@shared-types/assets/svg.asset.authored.types";

export class AppState {
  public readonly config: AppConfig;
  readonly #pages: AppPagesState;

  readonly #publicById: ReadonlyMap<string, PublicPage>;
  readonly #publicBySlug: ReadonlyMap<string, PublicPage>;
  readonly #errorByStatus: ReadonlyMap<ErrorPageStatus, ErrorPage>;

  public constructor(input: AppStateInput) {
    this.config = input.config;
    this.#pages = input.pages;

    if (!input.pages.publicById) {
      throw new Error("AppState missing pages.publicById");
    }

    if (!input.pages.publicBySlug) {
      throw new Error("AppState missing pages.publicBySlug");
    }

    if (!input.pages.errorByStatus) {
      throw new Error("AppState missing pages.errorByStatus");
    }

    this.#publicById = input.pages.publicById;
    this.#publicBySlug = input.pages.publicBySlug;
    this.#errorByStatus = input.pages.errorByStatus;
  }

  public get assets(): AppConfig["assets"] {
    return this.config.assets;
  }

  public get footer(): AppConfig["footer"] {
    return this.config.footer;
  }

  public get gone(): AppConfig["gone"] {
    return this.config.gone;
  }

  public get navigation(): AppConfig["navigation"] {
    return this.config.navigation;
  }

  public get redirects(): AppConfig["redirects"] {
    return this.config.redirects;
  }

  public get site(): AppConfig["site"] {
    return this.config.site;
  }

  public get social(): AppConfig["social"] {
    return this.config.social;
  }

  public get structuredData(): AppConfig["structuredData"] {
    return this.config.structuredData;
  }

  public get webManifest(): AppConfig["webManifest"] {
    return this.config.webManifest;
  }

  public get photoMetadata(): AppConfig["photoMetadata"] {
    return this.config.photoMetadata;
  }

  public get publicPages(): readonly PublicPage[] {
    return this.#pages.public;
  }

  public getPublicPageById(id: string): PublicPage | null {
    return this.#publicById.get(id) ?? null;
  }

  public getPublicPageBySlug(slug: string): PublicPage | null {
    return this.#publicBySlug.get(slug) ?? null;
  }

  public getErrorPageByStatus(status: ErrorPageStatus): ErrorPage | null {
    return this.#errorByStatus.get(status) ?? null;
  }

  public getScriptAssetById(id: string): ScriptAssetAuthored | null {
    return (
      this.config.assets.scripts.find((script) => script.id === id) ?? null
    );
  }

  public getSvgAssetById(id: string): SvgAssetAuthored | null {
    return this.config.assets.svgs.find((svg) => svg.id === id) ?? null;
  }
}
