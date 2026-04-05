// packages/shared-types/src/content/pages/public/home.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { HomePageContentAuthored } from "@shared-types/content/pages/public/home.public.page.content";

export type HomePageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "home";
};

export type HomePageDefinition = PublicPageDefinition<
  HomePageDefinitionCore,
  HomePageContentAuthored
>;
