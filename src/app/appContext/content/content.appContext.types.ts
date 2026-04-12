// src/app/appContext/content/content.appContext.types.ts

import type { AppContextListModule } from "@app/appContext/content/modules/list/list.module.appContext.types";
import type { AppContextParagraphModule } from "@app/appContext/content/modules/paragraph/paragraph.module.appContext.types";
import type { AppContextQuoteModule } from "@app/appContext/content/modules/quote/quote.module.appContext.types";
import type { AppContextHeroModule } from "@app/appContext/content/modules/hero/hero.module.appContext.types";
import type { AppContextJournalEntryFooterModule } from "@app/appContext/content/modules/journalEntryFooter/journalEntryFooter.module.appContext.types";
import type { AppContextJournalListingModule } from "@app/appContext/content/modules/journalListing/journalListing.module.appContext.types";

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
  footer?: AppContextJournalEntryFooterModule;
};

export type AppContextContentModule =
  | AppContextParagraphModule
  | AppContextQuoteModule
  | AppContextListModule
  | AppContextHeroModule
  | AppContextJournalListingModule;
