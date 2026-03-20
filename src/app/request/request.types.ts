// src/app/request/request.types.ts

import type { PageDefinition } from "@app/pages/page.definition";

export type RouteResult =
  | { kind: "found"; page: PageDefinition }
  | { kind: "not-found" };
