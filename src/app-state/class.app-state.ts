// src/app-state/class.appState.ts

import type { AppStateData } from "@app-state/types/app-state.types";
import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type { AppStateSocial } from "@shared-types/config/social/app-state.social.types";
import type { SystemGoneRule } from "@shared-types/config/system/gone-rules.system.types";
import type { SystemRedirectRule } from "@shared-types/config/system/redirect-rules.system.types";
import type { AppStateWebManifest } from "@shared-types/config/webmanifest/app-state.webmanifest.types";
import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";
import type { ErrorPageStatus } from "@shared-types/pages/error/status.error.page.types";
import type {
  PageIdError,
  PageIdPublic,
} from "@shared-types/pages/shared/id.shared.page.types";
import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";
import type { AppStateGlobalFooter } from "@shared-types/page-content/site/global-footer/app-state.global-footer.page-content.types";
import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AppStateStructuredData } from "@shared-types/config/structured-data/app-state.structured-data.types";

export class AppState {
  readonly #data: AppStateData;

  readonly #goneRulesByPath: ReadonlyMap<string, SystemGoneRule>;
  readonly #redirectRulesByPath: ReadonlyMap<string, SystemRedirectRule>;
  readonly #publicPagesBySlug: ReadonlyMap<
    string,
    AppStatePublicPageDefinition
  >;
  readonly #publicPagesById: ReadonlyMap<
    PageIdPublic,
    AppStatePublicPageDefinition
  >;
  readonly #errorPagesByStatus: ReadonlyMap<
    ErrorPageStatus,
    AppStateErrorPageDefinition
  >;

  readonly #errorPagesById: ReadonlyMap<
    PageIdError,
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

    this.#publicPagesById = new Map(
      data.pages.public.map((page) => [page.id, page] as const),
    );

    this.#publicPagesBySlug = new Map(
      data.pages.public.map((page) => [page.slug, page] as const),
    );

    this.#errorPagesByStatus = new Map(
      data.pages.error.map((page) => [page.status, page] as const),
    );

    this.#errorPagesById = new Map(
      data.pages.error.map((page) => [page.id, page] as const),
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

  public get social(): AppStateSocial {
    return this.#data.social;
  }

  public get navigation(): AppStateNavigation {
    return this.#data.navigation;
  }

  public get globalFooter(): AppStateGlobalFooter {
    return this.#data.globalFooter;
  }

  public get assets(): AppStateAssets {
    return this.#data.assets;
  }

  public get structuredData(): AppStateStructuredData {
    return this.#data.structuredData;
  }
  public getGoneRuleByPath(pathname: string): SystemGoneRule | null {
    return this.#goneRulesByPath.get(pathname) ?? null;
  }

  public getRedirectRuleByPath(pathname: string): SystemRedirectRule | null {
    return this.#redirectRulesByPath.get(pathname) ?? null;
  }

  public getPublicPageById(
    id: PageIdPublic,
  ): AppStatePublicPageDefinition | null {
    return this.#publicPagesById.get(id) ?? null;
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

  public getErrorPageById(id: PageIdError): AppStateErrorPageDefinition | null {
    return this.#errorPagesById.get(id) ?? null;
  }

  public get inspect(): AppStateData {
    return this.#data;
  }
}
