// src/app/renderContext/content/content.renderContext.types.ts

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
  text: string;
};

export type RenderContextQuoteModule = {
  kind: "quote";
  text: string;
  attribution?: string;
};

export type RenderContextContentModule =
  | RenderContextParagraphModule
  | RenderContextQuoteModule;
