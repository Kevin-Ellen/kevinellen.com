// shared-types/page-definitions/robots-txt/app-state.robots-txt.page-definition.types.ts

import type { AuthoredPageRobotsTxtDirectives } from "@shared-types/page-definitions/robots-txt/authored.robots-txt.page-definition.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStatePageRobotsTxtDirectivesDeterministicFields = Readonly<{
  disallow: boolean;
}>;

export type AppStatePageRobotsTxtDirectives = Replace<
  AuthoredPageRobotsTxtDirectives,
  AppStatePageRobotsTxtDirectivesDeterministicFields
>;
