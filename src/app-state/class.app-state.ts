// src/app-state/class.appState.ts

import type { AppStateData } from "@app-state/types/app-state.types";
import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";

import type { SystemGoneRule } from "@shared-types/config/system/gone-rules.system.types";
import type { SystemRedirectRule } from "@shared-types/config/system/redirect-rules.system.types";
import type { AppStateWebManifest } from "@shared-types/config/webmanifest/app-state.webmanifest.types";
import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";

// import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";

export class AppState {
  readonly #data: AppStateData;

  public constructor(data: AppStateData) {
    this.#data = data;
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

  public get inspect(): AppStateData {
    return this.#data;
  }
}
