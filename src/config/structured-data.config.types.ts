// src/config/structured-data.config.types.ts

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
