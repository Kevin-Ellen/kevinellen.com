// packages/content-pipeline/src/templates/create.article.template.ts

import type { ArticlePageDefinition } from "@shared-types/pages/page.definition";

export const createArticleTemplate = (): ArticlePageDefinition => ({
  core: {
    id: "",
    label: "",
    kind: "article",
    slug: "",
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
    pageTitle: "",
    metaDescription: "",
  },

  dated: {
    datePublished: null,
    dateModified: null,
  },

  navigation: {
    breadcrumbs: ["home"],
  },

  content: {
    head: {
      eyebrow: "",
      title: "",
      intro: "",
    },
    body: [],
    footer: [],
  },

  assets: {
    scripts: [],
    svgs: [],
  },

  structuredData: [],
});
