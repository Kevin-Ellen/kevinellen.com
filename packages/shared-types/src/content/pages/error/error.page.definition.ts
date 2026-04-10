// packages/shared-types/src/content/pages/error/error.page.definition.ts

import type {
  BasePageDefinition,
  BasePageDefinitionCore,
  PageRobotsAuthored,
} from "@shared-types/content/pages/base.page.definition";

export type ErrorPageStatus = 404 | 410 | 500;

export type BaseErrorPageDefinitionCore = BasePageDefinitionCore & {
  kind: "error";
  status: ErrorPageStatus;
};

export type ErrorPageConfigAuthored = {
  robots: PageRobotsAuthored;
};

export type BaseErrorPageDefinition<TContent> = BasePageDefinition<
  BaseErrorPageDefinitionCore,
  ErrorPageConfigAuthored,
  TContent
>;
