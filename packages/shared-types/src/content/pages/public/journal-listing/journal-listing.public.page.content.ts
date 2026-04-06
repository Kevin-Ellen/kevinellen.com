// packages/shared-types/src/content/pages/public/journal-listing.public.page.content.ts

export type JournalListingPageHeadingAuthored = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type JournalListingPageParagraphAuthored = {
  kind: "paragraph";
  inlines: readonly {
    kind: "text";
    text: string;
  }[];
};

export type JournalListingPageContentAuthored = {
  head: JournalListingPageHeadingAuthored;
  body: readonly JournalListingPageParagraphAuthored[];
  footer: readonly string[];
};
