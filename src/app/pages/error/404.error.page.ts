// src/app/pages/error/error-404.page.ts

import type { ErrorPageDefinition } from "@shared-types/pages/definitions/error.definition.page";

export const error404Page: ErrorPageDefinition = {
  core: {
    id: "error-404",
    kind: "error",
    status: 404,
    label: "Page not found",
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
    pageTitle: "404 | Page not found | Kevin Ellen",
    metaDescription: "The requested page could not be found.",
  },

  navigation: {
    breadcrumbs: [],
  },

  content: {
    head: {
      eyebrow: "404",
      title: "Page not found",
      intro:
        "The page you were looking for does not exist or is no longer available at this address.",
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
