// src/app/renderContext/content/content.renderContext.types.ts

import type { ContentInlineResolved } from "@app/renderContext/content/inline-content/inline-content.types";

export type RenderContextPageHeadContent = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type RenderContextContentSectionHeading = {
  text: string;
  visuallyHidden?: boolean;
  level: 2 | 3 | 4 | 5 | 6;
};

export type RenderContextContentSection = {
  kind: "contentSection";
  heading?: RenderContextContentSectionHeading;
  modules: readonly RenderContextContentModule[];
};

export type RenderContextPageBodyContent = {
  head: RenderContextPageHeadContent;
  sections: readonly RenderContextContentSection[];
};

// ALL NEW MODULES BELOW

export type RenderContextParagraphModule = {
  kind: "paragraph";
  content: readonly ContentInlineResolved[];
};

export type RenderContextQuoteModule = {
  kind: "quote";
  text: string;
  id: string;
  attribution?: string;
};

export type RenderContextContentModule =
  | RenderContextParagraphModule
  | RenderContextQuoteModule;
