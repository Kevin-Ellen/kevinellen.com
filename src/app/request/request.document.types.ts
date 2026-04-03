// src/app/request/request.document.types.ts

import type {
  ErrorPageDefinition,
  PageDefinition,
} from "@app/pages/page.definition";

export type DocumentRenderTarget =
  | {
      kind: "page";
      page: PageDefinition;
      status: 200;
    }
  | {
      kind: "error-page";
      page: ErrorPageDefinition;
      status: 404 | 410 | 500;
    };
