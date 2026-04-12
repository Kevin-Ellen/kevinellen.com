// shared-types/content/pages/shared/app-state.robots.shared.page.types.ts

export type AppStatePageRobotsDirectives = Readonly<{
  allowIndex: boolean;
  allowFollow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  noimageindex: boolean;
}>;

export type AppStatePageRobotsTxtDirectives = Readonly<{
  disallow: boolean;
}>;

export type AppStatePageSitemapDirectives = Readonly<{
  include: boolean;
}>;
