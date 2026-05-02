// src/app-state/resolve/pages.resolve.app-state.ts

import type { AppStatePages } from "@app-state/types/pages.app-state.types";

import { appStateResolvePublicPages } from "@app-state/resolve/pages/public.pages.resolve.app-state";
import { appStateResolveErrorPages } from "@app-state/resolve/pages/error.pages.resolve.app-state";

type AppStateResolvePagesArgs = Readonly<{
  kv: KVNamespace;
}>;

export const appStateResolvePages = async ({
  kv,
}: AppStateResolvePagesArgs): Promise<AppStatePages> => ({
  public: await appStateResolvePublicPages({ kv }),
  error: appStateResolveErrorPages(),
});
