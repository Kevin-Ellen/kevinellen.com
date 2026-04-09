// src/app/renderContext/content/content.renderContext.types.ts

import type { RenderContextParagraphModule } from "@app/renderContext/content/modules/paragraph/paragraph.module.renderContext.types";
import type { RenderContextQuoteModule } from "@app/renderContext/content/modules/quote/quote.module.renderContext.types";
import type { RenderContextListModule } from "@app/renderContext/content/modules/list/list.module.renderContext.types";
import type { RenderContextHeroModule } from "@app/renderContext/content/modules/hero/hero.module.renderContext.types";
import type { RenderContextJournalEntryFooterModule } from "@app/renderContext/content/modules/journalEntryFooter/journalEntryFooter.module.renderContext.types";

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
  footer?: RenderContextJournalEntryFooterModule;
};

export type RenderContextContentModule =
  | RenderContextParagraphModule
  | RenderContextQuoteModule
  | RenderContextListModule
  | RenderContextHeroModule;
