// src/content-schema/content/content.content-schema.authored.type.ts

import type {
  ContentRender,
  ContentPageType,
} from "./content.content-schema.type";

import type { ContentBodyAuthored } from "./body/body.content.content-schema.authored.type";

import type { PublicContentAuthored } from "./public.content.content-schema.authored.type";
import type { ErrorContentAuthored } from "./error.content.content-schema.authored.type";

export type ContentDatesAuthored = Readonly<{
  created: string;
  lastUpdated?: string;
}>;

export type PagePresentationAuthored = Readonly<{
  layout: "contained" | "full-bleed";
  header: Readonly<{
    appearance: "solid" | "transparent";
    colourScheme: "default" | "inverted";
  }>;
}>;

export type ContentCommonAuthored = Readonly<{
  id: string;
  render: ContentRender;
  pageType: ContentPageType;
  label: string;
  pagePresentation?: PagePresentationAuthored;
  status?: number;
  breadcrumbs: readonly string[];
  dates: ContentDatesAuthored;
  body: ContentBodyAuthored;
}>;

export type ContentAuthored = PublicContentAuthored | ErrorContentAuthored;
