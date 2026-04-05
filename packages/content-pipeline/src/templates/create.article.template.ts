// packages/content-pipeline/src/templates/create.article.template.ts

import type { ArticlePageDefinition } from "@shared-types/pages/page.definition";

type CreateArticleTemplateOptions = {
  slug?: string;
  title?: string;
  excerpt?: string;
};

const DEFAULT_ARTICLE_SLUG = "untitled-article";
const DEFAULT_ARTICLE_TITLE = "Untitled article";

export const createArticleTemplate = ({
  slug = DEFAULT_ARTICLE_SLUG,
  title = DEFAULT_ARTICLE_TITLE,
  excerpt = "",
}: CreateArticleTemplateOptions = {}): ArticlePageDefinition => {
  return {
    core: {
      id: `article:${slug}`,
      label: title,
      kind: "article",
      slug,
    },

    config: {
      robots: {
        allowIndex: false,
        allowFollow: false,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      robotsTxt: {
        disallow: true,
      },
      sitemap: {
        include: false,
      },
    },

    meta: {
      pageTitle: title,
      metaDescription: "",
    },

    navigation: {
      breadcrumbs: ["journal"],
    },

    excerpt,

    dated: {
      datePublished: null,
      dateModified: null,
    },

    structuredData: [],

    content: {
      head: {
        eyebrow: "Journal",
        title,
        intro: "",
      },
      body: [],
      footer: [],
    },

    assets: {
      scripts: [],
      svgs: [],
    },
  } satisfies ArticlePageDefinition;
};
