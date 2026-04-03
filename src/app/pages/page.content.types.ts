// src/app/pages/page.content.types.ts

import type { PageId } from "@app/pages/page.definition";

export type PageContentHero = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type PageContentInline =
  | {
      kind: "text";
      text: string;
    }
  | {
      kind: "internal-link";
      pageId: PageId;
      label: string;
    };

export type PageContentParagraph = {
  kind: "paragraph";
  inlines: readonly PageContentInline[];
};

export type PageContent = {
  head: PageContentHero;
  body: readonly PageContentParagraph[];
  footer: readonly string[];
};
