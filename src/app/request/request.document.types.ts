// src/app/request/request.document.types.ts

import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { ErrorPageStatus } from "@shared-types/content/pages/error/error.page.definition";

export type PublicPageRenderTarget = {
  kind: "public-page";
  page: PublicPage;
  status: 200;
};

export type ErrorPageRenderTarget = {
  kind: "error-page";
  page: ErrorPage;
  status: ErrorPageStatus;
};

export type DocumentRenderTarget =
  | PublicPageRenderTarget
  | ErrorPageRenderTarget;
