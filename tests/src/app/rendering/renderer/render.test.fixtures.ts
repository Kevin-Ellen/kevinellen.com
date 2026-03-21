// tests/src/app/rendering/renderer/render.test.fixtures.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

export const createDocumentRenderContext = (
  overrides: Partial<DocumentRenderContext> = {},
): DocumentRenderContext => {
  const base: DocumentRenderContext = {
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
      kind: "home",
      slug: "/",
      renderMode: "request-composed",
    },
    seo: {
      pageTitle: "Kevin Ellen",
      metaDescription:
        "Nature photography, journal writing, and technical architecture.",
      canonicalUrl: "https://kevinellen.com/",
    },
    pageHead: {
      navigation: {
        primary: [
          {
            id: "home",
            label: "Home",
            href: "/",
            isActive: true,
            iconId: "icon-home",
          },
          {
            id: "journal",
            label: "Journal",
            href: "/journal",
            isActive: false,
          },
          {
            id: "photos",
            label: "Photos",
            href: "/photos",
            isActive: false,
          },
          {
            id: "about",
            label: "About",
            href: "/about",
            isActive: false,
          },
        ],
        social: [
          {
            id: "gitHub",
            label: "GitHub",
            href: "https://github.com/Kevin-Ellen",
            isActive: false,
            iconId: "icon-github",
          },
          {
            id: "instagram",
            label: "Instagram",
            href: "https://www.instagram.com/photography.mallard",
            isActive: false,
            iconId: "icon-instagram",
          },
        ],
      },
      breadcrumbs: [
        {
          id: "home",
          label: "Home",
          href: "/",
        },
        {
          id: "journal",
          label: "Journal",
          href: "/journal",
        },
      ],
    },
    pageFooter: {
      navigation: {
        sections: [
          {
            id: "site",
            label: "Site",
            items: [
              {
                id: "home",
                label: "Home",
                href: "/",
                isActive: true,
              },
              {
                id: "about",
                label: "About",
                href: "/about",
                isActive: false,
              },
            ],
          },
          {
            id: "elsewhere",
            label: "Elsewhere",
            items: [
              {
                id: "gitHub",
                label: "GitHub",
                href: "https://github.com/Kevin-Ellen",
                isActive: false,
                iconId: "icon-github",
              },
            ],
          },
        ],
      },
    },
    content: {
      head: {
        eyebrow: "Kevin Ellen",
        title: "Nature, writing, and technical architecture",
        intro:
          "A personal platform for nature photography, field notes, articles, and transparent technical thinking.",
      },
      body: [],
      footer: [],
    },
    assets: {
      scripts: [
        {
          id: "head-script",
          kind: "external",
          src: "/static/head.js",
          location: "head",
          defer: true,
        },
        {
          id: "footer-inline",
          kind: "inline",
          content: "console.log('footer');",
          location: "footer",
        },
      ],
      svgs: [
        {
          id: "icon-home",
          viewBox: "0 0 24 24",
          content: "<path d='M1 1' />",
        },
        {
          id: "icon-github",
          viewBox: "0 0 24 24",
          content: "<path d='M2 2' />",
        },
      ],
    },
    structuredData: [],
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
  };

  return {
    ...base,
    ...overrides,
  };
};
