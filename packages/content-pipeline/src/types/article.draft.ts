// packages/content-pipeline/src/types/article.draft.ts

import type { PageId } from "@shared-types/pages/page.definition";

export type ArticleDraftDate = {
  datePublished: string | null;
  dateModified: string | null;
};

export type ArticleDraftHeroImageMetaItem = {
  term: string;
  detail: string;
};

export type ArticleDraftHeroImage = {
  imageId: string | null;
  alt: string;
  width: number | null;
  height: number | null;
  caption: string;
  meta: readonly ArticleDraftHeroImageMetaItem[];
};

export type ArticleDraftFooterField = {
  label: string;
  value: string;
};

export type ArticleDraftFooterGroup = {
  heading: string;
  items: readonly ArticleDraftFooterField[];
};

export type ArticleDraft = {
  id: string;
  slug: string;
  label: string;

  meta: {
    pageTitle: string;
    metaDescription: string;
  };

  dated: ArticleDraftDate;

  navigation: {
    breadcrumbs: readonly PageId[];
  };

  article: {
    eyebrow: string;
    title: string;
    intro: string;
    heroImage: ArticleDraftHeroImage | null;
    body: string;
    footer: {
      publication: readonly ArticleDraftFooterField[];
      fieldNotes: readonly ArticleDraftFooterField[];
      tags: readonly string[];
    };
  };
};
