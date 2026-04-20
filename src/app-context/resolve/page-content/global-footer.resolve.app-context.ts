// src/app-context/resolve/page-content/global-footer.resolve.app-context.ts

import type { AppContextGlobalFooter } from "@shared-types/page-content/site/global-footer/app-context.global-footer.page-content.types";
import type { AppStateGlobalFooter } from "@shared-types/page-content/site/global-footer/app-state.global-footer.page-content.types";

export const resolveGlobalFooterAppContext = (
  globalFooter: AppStateGlobalFooter,
): AppContextGlobalFooter => {
  return {
    ...globalFooter,
    affiliations: {
      ...globalFooter.affiliations,
      items: globalFooter.affiliations.items.map((item) => ({
        ...item,
      })),
    },
    colophon: {
      ...globalFooter.colophon,
    },
  };
};
