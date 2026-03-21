// tests/helpers/create.documentRenderContext.test.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

export const createDocumentRenderContext = (): DocumentRenderContext =>
  ({
    security: {
      nonce: "test-nonce",
    },
    site: {
      language: "en-GB",
      siteName: "Kevin Ellen",
      siteUrl: "https://kevinellen.com",
      socialMedia: {
        gitHub: {
          id: "gitHub",
          label: "GitHub",
          href: "https://github.com/Kevin-Ellen",
          iconId: "icon-github",
        },
        instagram: {
          id: "instagram",
          label: "Instagram",
          href: "https://www.instagram.com/photography.mallard",
          iconId: "icon-instagram",
        },
        linkedIn: {
          id: "linkedIn",
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/kevinellen/",
          iconId: "icon-linkedin",
        },
      },
    },
    page: {
      id: "home",
      kind: "static",
      slug: "/",
      renderMode: "bundled",
    },
    seo: {
      pageTitle: "Home",
      metaDescription: "Homepage description",
      canonicalUrl: "https://kevinellen.com/",
    },
    pageHead: {
      navigation: {
        primary: [],
        social: [],
      },
      breadcrumbs: [],
    },
    pageFooter: {
      navigation: {
        sections: [],
      },
    },
    content: {
      head: {
        eyebrow: "Eyebrow",
        title: "Title",
        intro: "Intro",
      },
      body: [],
      footer: [],
    },
    assets: {
      scripts: [],
      svgs: [],
    },
    structuredData: [],
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
  }) as DocumentRenderContext;
