// shared-types/config/structured-data/app-state.structured-data-reference.types.ts

import type { PageIdPublic } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";

export type AppStateStructuredDataPageReference = Readonly<{
  pageId: PageIdPublic;
  hash?: string;
}>;
