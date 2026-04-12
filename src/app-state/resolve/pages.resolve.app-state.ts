// src/app-state/resolve/pages.resolve.app-state.ts

import type { AppStatePages } from "@app-state/types/pages.app-state.types";

import { appStateResolvePublicPages } from "@app-state/resolve/pages/public.pages.resolve.app-state";
import { appStateResolveErrorPages } from "@app-state/resolve/pages/error.pages.resolve.app-state";

export const appStateResolvePages: AppStatePages = {
  public: appStateResolvePublicPages(),
  error: appStateResolveErrorPages(),
};
