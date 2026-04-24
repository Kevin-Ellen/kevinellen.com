// src/app-render-context/class.app-render-context.ts

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";
import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";

import type { AppRenderContextData } from "@app-render-context/app-render-context.types";
import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";
import type { AppRenderContextBodyFooter } from "@app-render-context/types/body-footer.app-render-context.types";
import type { AppRenderContextResponsePolicy } from "@app-render-context/types/response-policy.app-render-context.types";

export class AppRenderContext {
  readonly #data: AppRenderContextData;

  public constructor(data: AppRenderContextData) {
    this.#data = data;
  }

  public get data(): AppRenderContextData {
    return this.#data;
  }

  public get responsePolicy(): AppRenderContextResponsePolicy {
    return this.#data.responsePolicy;
  }

  public get docOpen(): AppRenderContextDocOpen {
    return this.#data.docOpen;
  }

  public get bodyHeader(): AppRenderContextBodyHeader {
    return this.#data.bodyHeader;
  }

  public get bodyContent(): any {
    return this.#data.bodyContent;
  }

  public get bodyFooter(): AppRenderContextBodyFooter {
    return this.#data.bodyFooter;
  }

  public get docClose(): AppRenderContextDocClose {
    return this.#data.docClose;
  }

  public get inspect(): AppRenderContextData {
    return this.#data;
  }
}
