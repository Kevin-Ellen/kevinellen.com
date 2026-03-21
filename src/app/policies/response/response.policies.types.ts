// src/app/policies/response/response.policies.types.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

export type ResponseKind = "document" | "resource" | "asset" | "direct";

export type DocumentResponsePolicyContext = {
  response: Response;
  responseKind: "document";
  status: number;
  documentRender: DocumentRenderContext;
  env: Env;
};

export type NonDocumentResponsePolicyContext = {
  response: Response;
  responseKind: "resource" | "asset" | "direct";
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
