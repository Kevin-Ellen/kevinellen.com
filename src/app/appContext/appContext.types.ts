// src/app/appContext.types.ts

export type ResponseKind = "document" | "resource" | "asset" | "direct";

export type ResponseFormat =
  | "html"
  | "json"
  | "xml"
  | "text"
  | "ico"
  | "woff2"
  | "image"
  | "binary";

export type AppContextDocument = {
  nonce?: string;
  robots?: string;
};

export type AppContextInit = {
  responseKind: ResponseKind;
  responseFormat: ResponseFormat;
  env: Env;
  document?: AppContextDocument;
};
