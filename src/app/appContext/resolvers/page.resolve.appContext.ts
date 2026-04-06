// src/app/appContext/resolvers/page.resolve.appContext.ts

import type { AppContextPage } from "@app/appContext/appContext.types";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";

type PageResolvable = PublicPage | ErrorPage;

export const resolvePageAppContext = (page: PageResolvable): AppContextPage => {
  return {
    id: page.core.id,
    kind: page.core.kind,
    label: page.core.label,
  };
};
