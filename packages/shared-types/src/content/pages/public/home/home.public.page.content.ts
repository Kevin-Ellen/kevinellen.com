// packages/shared-types/src/content/pages/public/home.public.page.content.ts

export type HomePageHeadingAuthored = {
  eyebrow: string;
  title: string;
  intro: string;
};

export type HomePageParagraphAuthored = {
  kind: "paragraph";
  inlines: readonly {
    kind: "text";
    text: string;
  }[];
};

export type HomePageContentAuthored = {
  head: HomePageHeadingAuthored;
  body: readonly HomePageParagraphAuthored[];
  footer: readonly string[];
};
