// packages/shared-types/src/pages/definitions/error.definition.page.ts

import type { StandardPageContent } from "../content/shared.content.types";

import type {
  BasePageDefinition,
  ErrorPageDefinitionConfig,
  ErrorPageDefinitionCore,
} from "./base.definition.page";

export type ErrorPageDefinition = BasePageDefinition<
  ErrorPageDefinitionCore,
  ErrorPageDefinitionConfig,
  StandardPageContent
>;
