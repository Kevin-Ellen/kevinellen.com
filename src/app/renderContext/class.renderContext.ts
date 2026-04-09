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
  RenderContextPhoto,
} from "@app/renderContext/renderContext.types";
import type { RenderContextPageBodyContent } from "@app/renderContext/content/content.renderContext.types";

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
  readonly #content: RenderContextPageBodyContent;
  readonly #photos: readonly RenderContextPhoto[];

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
    this.#content = input.content;
    this.#photos = input.photos;
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

  public get content(): RenderContextPageBodyContent {
    return this.#content;
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
      content: this.#content,
      photos: this.#photos,
    };
  }
}
