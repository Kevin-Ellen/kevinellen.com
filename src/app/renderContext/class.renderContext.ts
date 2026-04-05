// src/app/renderContext/class.renderContext.ts

import type {
  RenderContextDocument,
  RenderContextInput,
  RenderContextInspect,
  RenderContextPage,
  RenderContextSecurity,
} from "@app/renderContext/renderContext.types";
import type {
  AppContextBreadcrumb,
  AppContextMetadata,
  AppContextNavigation,
} from "@app/appContext/appContext.types";

export class RenderContext {
  readonly #document: RenderContextDocument;
  readonly #page: RenderContextPage;
  readonly #metadata: AppContextMetadata;
  readonly #breadcrumbs: readonly AppContextBreadcrumb[];
  readonly #navigation: AppContextNavigation;
  readonly #security: RenderContextSecurity;

  public constructor(input: RenderContextInput) {
    this.#document = input.document;
    this.#page = input.page;
    this.#metadata = input.metadata;
    this.#breadcrumbs = input.breadcrumbs;
    this.#navigation = input.navigation;
    this.#security = input.security;
  }

  public get document(): RenderContextDocument {
    return this.#document;
  }

  public get page(): RenderContextPage {
    return this.#page;
  }

  public get metadata(): AppContextMetadata {
    return this.#metadata;
  }

  public get breadcrumbs(): readonly AppContextBreadcrumb[] {
    return this.#breadcrumbs;
  }

  public get navigation(): AppContextNavigation {
    return this.#navigation;
  }

  public get security(): RenderContextSecurity {
    return this.#security;
  }

  public inspect(): RenderContextInspect {
    return {
      document: this.#document,
      page: this.#page,
      metadata: this.#metadata,
      breadcrumbs: this.#breadcrumbs,
      navigation: this.#navigation,
      security: this.#security,
    };
  }
}
