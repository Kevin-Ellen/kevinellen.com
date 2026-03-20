// src/app/pages/error/error.404.page.ts

import type { PageDefinition } from "@app/pages/page.definition";

export const error410page: PageDefinition = {
  core: {
    id: "error-410",
    kind: "error",
    slug: "/errors/410",
    renderMode: "request-composed",
  },

  config: {
    robots: {
      allowIndex: false,
      allowFollow: true,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
    robotsTxt: {
      disallow: false,
    },
    sitemap: {
      include: false,
    },
  },

  docHead: {
    pageTitle: "410 Gone | KevinEllen.com",
    metaDescription: "Page has been removed.",
  },

  pageHead: {
    breadcrumbs: ["home"],
  },

  content: {
    head: {
      eyebrow: "Error: 410",
      title: "Page Removed",
      intro: "This page has been removed.",
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
