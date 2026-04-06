// packages/shared-types/src/content/pages/public/home.public.page.content.ts

export type AboutPageHeadingAuthored = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type AboutPageParagraphAuthored = {
  kind: "paragraph";
  inlines: readonly {
    kind: "text";
    text: string;
  }[];
};

export type AboutPageContentAuthored = {
  head: AboutPageHeadingAuthored;
  body: readonly AboutPageParagraphAuthored[];
  footer: readonly string[];
};
