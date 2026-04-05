// src/app/renderContext/class.renderContext.ts

import type {
  RenderContextInput,
  RenderContextInspect,
  RenderContextMetadata,
  RenderContextPage,
  RenderContextSecurity,
} from "@app/renderContext/renderContext.types";

export class RenderContext {
  readonly #status: number;
  readonly #page: RenderContextPage;
  readonly #metadata: RenderContextMetadata;
  readonly #security: RenderContextSecurity;

  public constructor(input: RenderContextInput) {
    this.#status = input.status;
    this.#page = input.page;
    this.#metadata = input.metadata;
    this.#security = input.security;
  }

  public get status(): number {
    return this.#status;
  }

  public get page(): RenderContextPage {
    return this.#page;
  }

  public get metadata(): RenderContextMetadata {
    return this.#metadata;
  }

  public get security(): RenderContextSecurity {
    return this.#security;
  }

  public inspect(): RenderContextInspect {
    return {
      status: this.#status,
      page: this.#page,
      metadata: this.#metadata,
      security: this.#security,
    };
  }
}
