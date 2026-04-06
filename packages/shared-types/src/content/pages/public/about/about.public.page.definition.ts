// packages/shared-types/src/content/pages/public/home.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { AboutPageContentAuthored } from "@shared-types/content/pages/public/about/about.public.page.content";

export type AboutPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "longForm";
};

export type AboutPageDefinition = PublicPageDefinition<
  AboutPageDefinitionCore,
  AboutPageContentAuthored
>;
