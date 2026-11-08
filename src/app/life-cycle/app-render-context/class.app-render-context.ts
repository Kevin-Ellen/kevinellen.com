// src/app/life-cycle/app-render-context/class.app-render-context.ts

import type { MetadataAppRenderContext } from "../../types/document/metadata.document.app-render-context.type";
import type { DocumentAppRenderContext } from "../../types/document/document.app-render-context.type";

type AppRenderContextContext = Readonly<{
  metadata: MetadataAppRenderContext;
  document: DocumentAppRenderContext;
}>;

export class AppRenderContext {
  readonly #context: AppRenderContextContext;

  constructor(context: AppRenderContextContext) {
    this.#context = context;
  }

  get metadata(): MetadataAppRenderContext {
    return this.#context.metadata;
  }

  get document(): DocumentAppRenderContext {
    return this.#context.document;
  }

  get toInspectionSnapshot(): AppRenderContextContext {
    return this.#context;
  }
}
