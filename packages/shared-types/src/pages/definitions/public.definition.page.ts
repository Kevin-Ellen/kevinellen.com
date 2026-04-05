// packages/shared-types/src/pages/definitions/public.definition.page.ts

import type { StandardPageContent } from "../content/shared.content.types";
import type {
  BasePageDefinition,
  PageStructuredData,
  StandardPageDefinitionConfig,
  StandardPageDefinitionCore,
} from "./base.definition.page";
import type { HomePageDefinition } from "./home.definition.page";

export type StandardPageDefinition = BasePageDefinition<
  StandardPageDefinitionCore,
  StandardPageDefinitionConfig,
  StandardPageContent
> & {
  readonly structuredData: PageStructuredData;
};

export type PublicPageDefinition = StandardPageDefinition | HomePageDefinition;
