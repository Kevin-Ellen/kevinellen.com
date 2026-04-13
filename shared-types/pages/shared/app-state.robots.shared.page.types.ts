// shared-types/pages/shared/app-state.robots.shared.page.types.ts

import type {
  AuthoredPageRobotsDirectives,
  AuthoredPageRobotsTxtDirectives,
  AuthoredPageSitemapDirectives,
} from "@shared-types/pages/shared/authored.robots.shared.page.types";

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

type AppStatePageRobotsTxtDirectivesDeterministicFields = Readonly<{
  disallow: boolean;
}>;

export type AppStatePageRobotsTxtDirectives = Replace<
  AuthoredPageRobotsTxtDirectives,
  AppStatePageRobotsTxtDirectivesDeterministicFields
>;

type AppStatePageSitemapDirectivesDeterministicFields = Readonly<{
  include: boolean;
}>;

export type AppStatePageSitemapDirectives = Replace<
  AuthoredPageSitemapDirectives,
  AppStatePageSitemapDirectivesDeterministicFields
>;
