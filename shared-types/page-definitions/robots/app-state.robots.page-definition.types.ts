// shared-types/page-definitions/robots/app-state.robots.page-definition.types.ts

import type { AuthoredPageRobotsDirectives } from "@shared-types/page-definitions/robots/authored.robots.page-definition.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStatePageRobotsDirectivesDeterministicFields = Readonly<{
  allowIndex: boolean;
  allowFollow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  noimageindex: boolean;
}>;

export type AppStatePageRobotsDirectives = Replace<
  AuthoredPageRobotsDirectives,
  AppStatePageRobotsDirectivesDeterministicFields
>;
