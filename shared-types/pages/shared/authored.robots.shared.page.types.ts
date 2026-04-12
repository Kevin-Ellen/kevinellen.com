// shared-types/content/pages/shared/app-state.robots.shared.page.types.ts

export type AuthoredPageRobotsDirectives = Readonly<{
  allowIndex?: boolean;
  allowFollow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
}>;

export type AuthoredPageRobotsTxtDirectives = Readonly<{
  disallow?: boolean;
}>;

export type AuthoredPageSitemapDirectives = Readonly<{
  include?: boolean;
}>;
