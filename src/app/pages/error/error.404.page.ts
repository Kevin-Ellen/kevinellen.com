// src/app/pages/error/error.404.page.ts

import type { PageDefinition } from "@app/pages/page.definition";

export const error404page: PageDefinition = {
  core: {
    id: "error-404",
    kind: "error",
    slug: "/errors/404",
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
    pageTitle: "404 Not Found | KevinEllen.com",
    metaDescription: "Page was not found.",
  },

  pageHead: {
    breadcrumbs: ["home"],
  },

  content: {
    head: {
      eyebrow: "Error: 404",
      title: "Page not found",
      intro: "This page was not found.",
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
