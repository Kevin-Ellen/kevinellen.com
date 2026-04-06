// src/app/renderContext/class.renderContext.ts

import type {
  RenderContextDocument,
  RenderContextFooter,
  RenderContextHead,
  RenderContextMetadata,
  RenderContextModel,
  RenderContextPage,
  RenderContextSecurity,
  RenderContextHeader,
  RenderContextPageFooter,
  RenderContextStructuredData,
} from "@app/renderContext/renderContext.types";

export class RenderContext {
  readonly #document: RenderContextDocument;
  readonly #page: RenderContextPage;
  readonly #metadata: RenderContextMetadata;
  readonly #head: RenderContextHead;
  readonly #header: RenderContextHeader;
  readonly #footer: RenderContextFooter;
  readonly #security: RenderContextSecurity;
  readonly #pageFooter: RenderContextPageFooter;
  readonly #structuredData: RenderContextStructuredData;

  public constructor(input: RenderContextModel) {
    this.#document = input.document;
    this.#page = input.page;
    this.#metadata = input.metadata;
    this.#head = input.head;
    this.#footer = input.footer;
    this.#security = input.security;
    this.#header = input.header;
    this.#pageFooter = input.pageFooter;
    this.#structuredData = input.structuredData;
  }

  public get document(): RenderContextDocument {
    return this.#document;
  }

  public get page(): RenderContextPage {
    return this.#page;
  }

  public get metadata(): RenderContextMetadata {
    return this.#metadata;
  }

  public get head(): RenderContextHead {
    return this.#head;
  }

  public get footer(): RenderContextFooter {
    return this.#footer;
  }

  public get security(): RenderContextSecurity {
    return this.#security;
  }

  public get header(): RenderContextHeader {
    return this.#header;
  }

  public get pageFooter(): RenderContextPageFooter {
    return this.#pageFooter;
  }

  public get structuredData(): RenderContextStructuredData {
    return this.#structuredData;
  }

  public inspect(): RenderContextModel {
    return {
      document: this.#document,
      page: this.#page,
      metadata: this.#metadata,
      head: this.#head,
      header: this.#header,
      footer: this.#footer,
      security: this.#security,
      pageFooter: this.#pageFooter,
      structuredData: this.#structuredData,
    };
  }
}
