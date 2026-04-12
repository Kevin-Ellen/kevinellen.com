// packages/shared-types/src/content/pages/public/featured.public.page.types

type FeaturedPlacement = "journal-listing" | "home" | "articles-listing";

export type FeaturedSettings = {
  surface: FeaturedPlacement;
};
