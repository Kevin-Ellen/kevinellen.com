// src/app/pages/error/error-500.page.ts

import type { ErrorPageDefinition } from "@shared-types/pages/page.definition";

export const error500Page: ErrorPageDefinition = {
  core: {
    id: "error-500",
    kind: "error",
    status: 500,
    label: "Internal server error",
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
    pageTitle: "500 | Internal server error | Kevin Ellen",
    metaDescription:
      "An unexpected error occurred while processing your request.",
  },

  navigation: {
    breadcrumbs: [],
  },

  content: {
    head: {
      eyebrow: "500",
      title: "Something went wrong",
      intro:
        "An unexpected error occurred while processing your request. Please try again later.",
    },
    body: [
      {
        kind: "paragraph",
        inlines: [
          {
            kind: "text",
            text: "If the issue persists, it may be a temporary problem. You can return to the homepage or try again shortly.",
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
