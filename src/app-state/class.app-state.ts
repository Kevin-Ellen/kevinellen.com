// src/app-state/class.appState.ts

import type { AppStateData } from "@app-state/types/app-state.types";
import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type { SystemGoneRule } from "@shared-types/config/system/gone-rules.system.types";
import type { SystemRedirectRule } from "@shared-types/config/system/redirect-rules.system.types";
import type { AppStateWebManifest } from "@shared-types/config/webmanifest/app-state.webmanifest.types";
import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";
import type { ErrorPageStatus } from "@shared-types/pages/error/status.error.page.types";

export class AppState {
  readonly #data: AppStateData;

  readonly #goneRulesByPath: ReadonlyMap<string, SystemGoneRule>;
  readonly #redirectRulesByPath: ReadonlyMap<string, SystemRedirectRule>;
  readonly #publicPagesBySlug: ReadonlyMap<
    string,
    AppStatePublicPageDefinition
  >;
  readonly #errorPagesByStatus: ReadonlyMap<
    ErrorPageStatus,
    AppStateErrorPageDefinition
  >;

  public constructor(data: AppStateData) {
    this.#data = data;

    this.#goneRulesByPath = new Map(
      data.system.goneRules.map((rule) => [rule.path, rule] as const),
    );

    this.#redirectRulesByPath = new Map(
      data.system.redirectRules.map((rule) => [rule.fromPath, rule] as const),
    );

    this.#publicPagesBySlug = new Map(
      data.pages.public.map((page) => [page.slug, page] as const),
    );

    this.#errorPagesByStatus = new Map(
      data.pages.error.map((page) => [page.status, page] as const),
    );
  }

  public get siteConfig(): AppStateSiteConfig {
    return this.#data.siteConfig;
  }

  public get goneRules(): readonly SystemGoneRule[] {
    return this.#data.system.goneRules;
  }

  public get redirectRules(): readonly SystemRedirectRule[] {
    return this.#data.system.redirectRules;
  }

  public get manifest(): AppStateWebManifest {
    return this.#data.webManifest;
  }

  public get publicPages(): readonly AppStatePublicPageDefinition[] {
    return this.#data.pages.public;
  }

  public get errorPages(): readonly AppStateErrorPageDefinition[] {
    return this.#data.pages.error;
  }

  public getGoneRuleByPath(pathname: string): SystemGoneRule | null {
    return this.#goneRulesByPath.get(pathname) ?? null;
  }

  public getRedirectRuleByPath(pathname: string): SystemRedirectRule | null {
    return this.#redirectRulesByPath.get(pathname) ?? null;
  }

  public getPublicPageBySlug(
    slug: string,
  ): AppStatePublicPageDefinition | null {
    return this.#publicPagesBySlug.get(slug) ?? null;
  }

  public getErrorPageByStatus(
    status: ErrorPageStatus,
  ): AppStateErrorPageDefinition | null {
    return this.#errorPagesByStatus.get(status) ?? null;
  }

  public get inspect(): AppStateData {
    return this.#data;
  }
}
