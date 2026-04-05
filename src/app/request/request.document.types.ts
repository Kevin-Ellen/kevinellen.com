// src/app/request/request.document.types.ts

import type { ErrorPageDefinition } from "@shared-types/pages/definitions/error.definition.page";
import type { PublicPageDefinition } from "@shared-types/pages/definitions/public.definition.page";

export type DocumentRenderTarget =
  | {
      kind: "page";
      page: PublicPageDefinition;
      status: 200;
    }
  | {
      kind: "error-page";
      page: ErrorPageDefinition;
      status: 404 | 410 | 500;
    };

export type RenderedDocumentSecurity = {
  nonce: string;
};

export type RenderedDocumentResult = {
  response: Response;
  security: RenderedDocumentSecurity;
};
