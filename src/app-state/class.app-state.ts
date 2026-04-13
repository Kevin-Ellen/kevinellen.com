// src/app-state/class.appState.ts

import type { AppStateData } from "@app-state/types/app-state.types";

// import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";

export class AppState {
  readonly #data: AppStateData;

  public constructor(data: AppStateData) {
    this.#data = data;
  }

  public get inspect(): AppStateData {
    return this.#data;
  }
}
