// src/app/pages/content/block.content.page.types.ts

import type { PageContentInline } from "@shared-types/pages/content/inline.content.page.types";

export type PageContentHero = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type PageContentParagraph = {
  kind: "paragraph";
  inlines: readonly PageContentInline[];
};
