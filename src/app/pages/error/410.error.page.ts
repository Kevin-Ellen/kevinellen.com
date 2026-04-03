// src/app/pages/error/error-410.page.ts

import type { ErrorPageDefinition } from "@app/pages/page.definition";

export const error410Page: ErrorPageDefinition = {
  core: {
    id: "error-410",
    kind: "error",
    status: 410,
    label: "Gone",
  },

  config: {
    robots: {
      allowIndex: false,
      allowFollow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },

  meta: {
    pageTitle: "410 | Page is gone | Kevin Ellen",
    metaDescription: "The requested page does not exist anymore.",
  },

  navigation: {
    breadcrumbs: [],
  },

  content: {
    head: {
      eyebrow: "410",
      title: "Gone",
      intro: "The page you were looking for does not exist anymore.",
    },
    body: [
      {
        kind: "paragraph",
        inlines: [
          {
            kind: "text",
            text: "Please check the URL, return to the homepage, or use the site navigation to continue browsing.",
          },
        ],
      },
    ],
    footer: [],
  },

  assets: {
    scripts: [],
    svgs: [],
  },
};
