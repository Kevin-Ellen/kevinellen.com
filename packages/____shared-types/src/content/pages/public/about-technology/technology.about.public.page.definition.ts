// packages/shared-types/src/content/pages/public/about-technology/technology.about.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { TechnologyAboutPageContentAuthored } from "@shared-types/content/pages/public/about-technology/technology.about.public.page.content";

export type TechnologyAboutPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "longForm";
};

export type TechnologyAboutPageDefinition = PublicPageDefinition<
  TechnologyAboutPageDefinitionCore,
  TechnologyAboutPageContentAuthored
>;
