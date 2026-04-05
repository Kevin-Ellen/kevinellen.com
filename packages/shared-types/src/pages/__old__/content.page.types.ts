// packages/shared-types/src/pages/content/content.page.types.ts

import type {
  PageContentHero,
  PageContentParagraph,
} from "@shared-types/pages/content/block.content.page.types";

export type StandardPageContent = {
  head: PageContentHero;
  body: readonly PageContentParagraph[];
  footer: readonly string[];
};

export type {
  PageContentHero,
  PageContentParagraph,
} from "@shared-types/pages/content/block.content.page.types";

export type {
  PageContentExternalLinkInline,
  PageContentInline,
  PageContentInternalLinkInline,
  PageContentLinkInline,
  PageContentTextInline,
} from "@shared-types/pages/content/inline.content.page.types";
