// src/app/system/robots/robots.types.ts

export type RobotsRule = {
  readonly userAgent: string;
  readonly allow?: readonly string[];
  readonly disallow?: readonly string[];
};

export type RobotsDocument = {
  readonly rules: readonly RobotsRule[];
  readonly sitemaps: readonly string[];
};
