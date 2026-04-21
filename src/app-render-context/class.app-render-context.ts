// src/app-render-context/class.app-render-context.ts

import type {
  AppRenderContextData,
  AppRenderContextDocOpen,
  AppRenderContextDocClose,
} from "@app-render-context/app-render-context.types";

export class AppRenderContext {
  readonly #data: AppRenderContextData;

  public constructor(data: AppRenderContextData) {
    this.#data = data;
  }

  public get data(): AppRenderContextData {
    return this.#data;
  }

  public get docOpen(): AppRenderContextDocOpen {
    return this.#data.docOpen;
  }

  public get docClose(): AppRenderContextDocClose {
    return this.#data.docClose;
  }

  public get inspect(): AppRenderContextData {
    return this.#data;
  }
}
