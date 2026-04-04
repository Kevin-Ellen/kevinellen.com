// src/app/content/block.content.types.ts

import type { ContentInline } from "@app/content/inline.content.types.ts";

export type ContentHero = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type ContentParagraph = {
  kind: "paragraph";
  inlines: readonly ContentInline[];
};
