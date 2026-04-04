// src/app/rendering/document/document.render.types.ts

export type DocumentRenderContext = {
  security: {
    nonce: string;
  };
  site: {
    language: string;
    siteName: string;
    siteUrl: string;
  };
  seo: {
    canonicalUrl: string | null;
    pageTitle: string;
    metaDescription: string;
  };
  navigation: {
    header: {
      primary: readonly {
        label: string;
        href: string;
        isCurrent: boolean;
        svgId?: string;
      }[];
      social: readonly {
        label: string;
        href: string;
        svgId?: string;
      }[];
    };
    footer: {
      sections: readonly {
        id: string;
        label: string;
        items: readonly {
          label: string;
          href: string;
          svgId?: string;
        }[];
      }[];
    };
  };
  breadcrumbs: readonly {
    label: string;
    href: string;
  }[];
  content: {
    head: {
      eyebrow: string;
      title: string;
      intro: string;
    };
    body: readonly {
      kind: "paragraph";
      inlines: readonly (
        | {
            kind: "text";
            text: string;
          }
        | {
            kind: "internal-link";
            pageId: string;
            label: string;
            href: string;
          }
      )[];
    }[];
    footer: readonly string[];
  };
  structuredData: {
    person: unknown;
    website: unknown;
    page: unknown;
  };
};
