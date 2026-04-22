// src/app-state/types/pages.app-state.types.ts

import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

export type AppStatePages = Readonly<{
  public: readonly AppStatePageDefinition[];
  error: readonly AppStatePageDefinition[];
}>;
