// src/app/content/content.page.types.ts

import type {
  ContentHero,
  ContentParagraph,
} from "@app/content/block.content.types";

export type Content = {
  head: ContentHero;
  body: readonly ContentParagraph[];
  footer: readonly string[];
};

export type {
  ContentHero,
  ContentParagraph,
} from "@app/content/block.content.types";

export type {
  ContentInline,
  ContentInternalLinkInline,
  ContentExternalLinkInline,
  ContentLinkInline,
  ContentTextInline,
} from "@app/content/inline.content.types.ts";
