// shared-types/pages/definitions/error/app-context.base.error.definition.page.types.ts

import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextErrorPageDefinitionRuntime = Readonly<{}>;

export type AppContextErrorPageDefinition = Replace<
  AppStateErrorPageDefinition,
  AppContextErrorPageDefinitionRuntime
>;
