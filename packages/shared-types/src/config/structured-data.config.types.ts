// src/config/structured-data.config.types.ts

import type { Graph, Thing, WithContext } from "schema-dts";

export type StructuredDataPersonConfig = {
  id: string;
  url: string;
  name: string;
  jobTitle: string;
  description: string;
  addressRegion: string;
  addressCountry: string;
  knowsAbout: readonly string[];
};

export type StructuredDataWebSiteConfig = {
  id: string;
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  publisherId: string;
};

export type StructuredDataConfig = {
  person: StructuredDataPersonConfig;
  website: StructuredDataWebSiteConfig;
};

export type PageStructuredDataNode = Thing;
export type PageStructuredDataDocument =
  | readonly PageStructuredDataNode[]
  | Graph
  | WithContext<PageStructuredDataNode>;
