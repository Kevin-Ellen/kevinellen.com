// src/app/appContext/appContext.ts

import type {
  AppContextDocument,
  AppContextInit,
  ResponseFormat,
  ResponseKind,
} from "@app/appContext/appContext.types";

export class AppContext {
  private readonly responseKind: ResponseKind;
  private readonly responseFormat: ResponseFormat;
  private readonly env: Env;
  private readonly document: AppContextDocument;

  constructor(init: AppContextInit) {
    this.responseKind = init.responseKind;
    this.responseFormat = init.responseFormat;
    this.env = init.env;
    this.document = init.document ?? {};
  }

  public getResponseKind(): ResponseKind {
    return this.responseKind;
  }

  public getResponseFormat(): ResponseFormat {
    return this.responseFormat;
  }

  public getEnv(): Env {
    return this.env;
  }

  public getDocument(): AppContextDocument {
    return this.document;
  }

  public toJSON(): Record<string, unknown> {
    return {
      responseKind: this.responseKind,
      responseFormat: this.responseFormat,
      document: this.document,
    };
  }
}
