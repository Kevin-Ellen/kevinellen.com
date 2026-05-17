// src/app-context/resolve/shell/footer/global-footer.resolve.app-context.ts

import type { AppContextGlobalFooter } from "@shared-types/page-content/site/global-footer/app-context.global-footer.types";
import type { AppStateGlobalFooter } from "@shared-types/page-content/site/global-footer/app-state.global-footer.types";

export const appContextResolveGlobalFooter = (
  globalFooter: AppStateGlobalFooter,
): AppContextGlobalFooter => {
  return globalFooter;
};
