// packages/shared-types/src/content/pages/error/error.page.content.ts

export type ErrorPageHeadingAuthored = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type ErrorPageParagraphAuthored = {
  kind: "paragraph";
  inlines: readonly {
    kind: "text";
    text: string;
  }[];
};

export type ErrorPageContentAuthored = {
  head: ErrorPageHeadingAuthored;
  body: readonly ErrorPageParagraphAuthored[];
  footer: readonly string[];
};
