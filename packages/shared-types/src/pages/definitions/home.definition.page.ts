// packages/shared-types/src/pages/definitions/home.definition.page.ts

import type { StandardPageContent } from "../content/shared.content.types";
import type {
  BasePageDefinition,
  PageStructuredData,
  StandardPageDefinitionConfig,
  StandardPageDefinitionCore,
} from "./base.definition.page";

export type HomePageDefinitionCore = StandardPageDefinitionCore & {
  kind: "home";
  slug: "/";
};

export type HomePageDefinition = BasePageDefinition<
  HomePageDefinitionCore,
  StandardPageDefinitionConfig,
  StandardPageContent
> & {
  readonly structuredData: PageStructuredData;
};
