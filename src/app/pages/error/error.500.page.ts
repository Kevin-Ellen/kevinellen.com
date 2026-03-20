// src/app/pages/error/error.500.page.ts

import type { PageDefinition } from "@app/pages/page.definition";

export const error500page: PageDefinition = {
  core: {
    id: "error-500",
    kind: "error",
    slug: "/errors/500",
    renderMode: "request-composed",
    label: "500: Server error",
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
    pageTitle: "500 Server Error | KevinEllen.com",
    metaDescription: "Something went wrong!",
  },

  pageHead: {
    breadcrumbs: ["home"],
  },

  content: {
    head: {
      eyebrow: "Error: 500",
      title: "Server Error",
      intro: "Something went wrong with the application.",
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
