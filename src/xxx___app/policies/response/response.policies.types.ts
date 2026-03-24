// src/app/policies/response/response.policies.types.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

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

export type DocumentResponsePolicyContext = {
  response: Response;
  responseKind: "document";
  responseFormat: ResponseFormat;
  status: number;
  documentRender: DocumentRenderContext;
  env: Env;
};

export type NonDocumentResponsePolicyContext = {
  response: Response;
  responseKind: "resource" | "asset" | "direct";
  responseFormat: ResponseFormat;
  status: number;
  env: Env;
};

export type ResponsePolicyContext =
  | DocumentResponsePolicyContext
  | NonDocumentResponsePolicyContext;

export type DocumentResponsePolicyContextInternal = Extract<
  ResponsePolicyContext,
  { responseKind: "document" }
>;
