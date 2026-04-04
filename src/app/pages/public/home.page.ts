// src/app/pages/public/home.page.ts

import type { PageDefinition } from "@shared-types/pages/page.definition";

export const homePage: PageDefinition = {
  core: {
    id: "home",
    kind: "home",
    slug: "/",
    label: "Home",
  },

  config: {
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
    robotsTxt: {
      disallow: false,
    },
    sitemap: {
      include: true,
    },
  },

  meta: {
    pageTitle: "Kevin Ellen",
    metaDescription:
      "Nature photography, field notes, journal writing, and technical architecture.",
  },

  navigation: {
    breadcrumbs: ["home"],
  },

  content: {
    head: {
      eyebrow: "Kevin Ellen",
      title: "Nature photography, writing, and technical architecture",
      intro:
        "A personal platform for photography, journal entries, articles, and transparent technical thinking.",
    },
    body: [
      {
        kind: "paragraph",
        inlines: [
          {
            kind: "text",
            text: "Homepage placeholder body content.",
          },
        ],
      },
      {
        kind: "paragraph",
        inlines: [
          {
            kind: "text",
            text: "This section will later introduce featured photography, journal entries, and technical work.",
          },
        ],
      },
    ],
    footer: ["Homepage placeholder footer content."],
  },

  assets: {
    scripts: [],
    svgs: [],
  },

  structuredData: [],
};
