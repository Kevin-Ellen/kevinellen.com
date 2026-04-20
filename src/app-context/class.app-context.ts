// src/app-context/class.app-context.ts

import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type { AppContextErrorPageDefinition } from "@shared-types/pages/definitions/error/app-context.base.error.definition.page.types";
import type { AppContextPublicPageDefinition } from "@shared-types/pages/definitions/public/app-context.public.definition.page.types";

type AppContextPage =
  | AppContextPublicPageDefinition
  | AppContextErrorPageDefinition;

export class AppContext {
  readonly #siteConfig: AppStateSiteConfig;
  readonly #page: AppContextPage;

  public constructor(input: {
    siteConfig: AppStateSiteConfig;
    page: AppContextPage;
  }) {
    this.#siteConfig = input.siteConfig;
    this.#page = input.page;
  }

  public get siteConfig(): AppStateSiteConfig {
    return this.#siteConfig;
  }

  public get page(): AppContextPage {
    return this.#page;
  }
}
