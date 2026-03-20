// src/app/pages/home.page.ts

import type { PageDefinition } from "@app/pages/page.definition";

export const homePage: PageDefinition = {
  core: {
    id: "home",
    kind: "home",
    slug: "/",
    renderMode: "request-composed",
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

  docHead: {
    pageTitle: "Kevin Ellen",
    metaDescription:
      "Nature photography, journal writing, and technical architecture.",
  },

  pageHead: {
    breadcrumbs: ["home"],
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

  docFooter: {
    scripts: [],
    svgs: [],
    structuredData: [],
  },
};
