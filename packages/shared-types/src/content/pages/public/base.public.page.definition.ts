// packages/shared-types/src/content/pages/public/base.public.page.definition.ts

import type {
  BasePageDefinition,
  BasePageDefinitionCore,
  PublicPageConfigAuthored,
} from "@shared-types/content/pages/base.page.definition";
import type { StructuredDataNodeAuthored } from "@shared-types/structured-data/structured-data.authored.types";

export type BasePublicPageDefinitionCore = BasePageDefinitionCore & {
  slug: string;
};

export type PublicPageDefinition<
  TCore extends BasePublicPageDefinitionCore,
  TContent,
> = BasePageDefinition<TCore, PublicPageConfigAuthored, TContent> & {
  structuredData: readonly StructuredDataNodeAuthored[];
};
