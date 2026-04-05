// packages/shared-types/src/pages/content/content.page.types.ts

export type PageContentInline =
  | {
      kind: "text";
      text: string;
    }
  | {
      kind: "external-link";
      label: string;
      href: string;
    }
  | {
      kind: "internal-link";
      label: string;
      pageId: string;
    };

export type PageContentParagraph = {
  kind: "paragraph";
  inlines: readonly PageContentInline[];
};

export type PageContent = {
  head: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  body: readonly PageContentParagraph[];
  footer: readonly string[];
};

export type StandardPageContent = PageContent;
