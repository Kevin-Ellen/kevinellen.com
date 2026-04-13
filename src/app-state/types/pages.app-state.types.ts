// src/app-state/types/pages.app-state.types.ts

import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";

export type AppStateErrorPages = readonly AppStateErrorPageDefinition[];
export type AppStatePublicPages = readonly AppStatePublicPageDefinition[];

export type AppStatePages = Readonly<{
  public: AppStatePublicPages;
  error: AppStateErrorPages;
}>;
