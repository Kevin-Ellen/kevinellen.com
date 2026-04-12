// src/app/renderContext/content/modules/journalListing/journalListing.resolve.renderContext.types.ts

import type { AppContextJournalListingModule } from "@app/appContext/content/modules/journalListing/journalListing.module.appContext.types";
import type { RenderContextJournalListingModule } from "./journalListing.module.renderContext.types";
import type { RenderContextModuleResolverDependencies } from "@app/renderContext/content/modules/module.resolve.renderContext.types";

import { getPublishedDate } from "@app/appContext/helpers/publishedDate.extract.helper.appContext";
import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";

const LISTING_IMAGE_BASE = 100;
const LISTING_IMAGE_WIDTHS = [320, 480, 768] as const;
const LISTING_IMAGE_SIZES = "(max-width: 768px) 100vw, 320px";

type ListingImageWidth = (typeof LISTING_IMAGE_WIDTHS)[number];

const buildVariantSourceUrl = (
  baseUrl: string,
  width: ListingImageWidth,
): string => {
  return `${baseUrl}${String(width)}`;
};

const buildSrcSet = (baseUrl: string): string => {
  return LISTING_IMAGE_WIDTHS.map(
    (width) => `${buildVariantSourceUrl(baseUrl, width)} ${width}w`,
  ).join(", ");
};

const pickDefaultSrc = (baseUrl: string): string => {
  return buildVariantSourceUrl(baseUrl, 480);
};

export const resolveJournalListingRenderContext = (
  module: AppContextJournalListingModule,
  _dependencies: RenderContextModuleResolverDependencies,
): RenderContextJournalListingModule => {
  return {
    kind: "journalListing",
    flow: "content",
    entries: module.entries.map(({ page, photo }) => {
      const baseUrl = photo.image.urls.frame;

      if (!baseUrl) {
        throw new Error(
          `Journal listing photo "${photo.id}" is missing "frame" URL.`,
        );
      }

      const dimensions = normaliseDimensionsToBase(
        photo.intrinsic.width,
        photo.intrinsic.height,
        LISTING_IMAGE_BASE,
      );

      return {
        id: page.core.id,
        href: page.core.slug,
        title: page.core.label,
        intro: page.content.head.intro ?? "",
        publishedAt: getPublishedDate(page),
        featuredIn: page.core.featuredIn ?? [],
        photo: {
          src: pickDefaultSrc(baseUrl),
          srcset: buildSrcSet(baseUrl),
          sizes: LISTING_IMAGE_SIZES,
          alt: photo.alt,
          width: dimensions.width,
          height: dimensions.height,
        },
      };
    }),
  };
};
