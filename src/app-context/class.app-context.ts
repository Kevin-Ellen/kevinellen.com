// src/app-context/class.app-context.ts

import type { AppContextData } from "@app-context/app-context.types";
import type { AppContextNavigation } from "@shared-types/config/navigation/app-context.navigation.types";
import type { AppContextGlobalFooter } from "@shared-types/page-content/site/global-footer/app-context.global-footer.page-content.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
// import type { AppContextPublicPageDefinition } from "@shared-types/pages/definitions/public/app-context.public.definition.page.types";
// import type { AppContextErrorPageDefinition } from "@shared-types/pages/definitions/error/app-context.base.error.definition.page.types";

export class AppContext {
  readonly #data: AppContextData;

  readonly #navigation: AppContextNavigation;
  readonly #globalFooter: AppContextGlobalFooter;
  readonly #structuredData: readonly AppContextStructuredDataEntry[];

  public constructor(data: AppContextData) {
    this.#data = data;
    this.#navigation = data.navigation;
    this.#globalFooter = data.globalFooter;
    this.#structuredData = data.structuredData;
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

  public get inspect(): AppContextData {
    return this.#data;
  }
}
