// src/app/appContext/content/content.appContext.types.ts

import { ContentInlineResolved } from "@app/appContext/content/inline-content/inline-content.types";

export type AppContextPageHeadContent = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type AppContextContentSection = {
  kind: "contentSection";
  heading?: {
    text: string;
    visuallyHidden?: boolean;
    level: 2 | 3 | 4 | 5 | 6;
  };
  modules: readonly AppContextContentModule[];
};

export type AppContextPageBodyContent = {
  head: AppContextPageHeadContent;
  sections: readonly AppContextContentSection[];
};

export type AppContextParagraphModule = {
  kind: "paragraph";
  content: readonly ContentInlineResolved[];
};

export type AppContextQuoteModule = {
  kind: "quote";
  text: string;
  id: string;
  attribution?: string;
};

export type AppContextContentModule =
  | AppContextParagraphModule
  | AppContextQuoteModule;
