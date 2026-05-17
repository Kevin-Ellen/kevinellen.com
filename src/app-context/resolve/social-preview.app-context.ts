// src/app-context/resolve/social-preview.app-context.ts

import type { AppStateSocialPreview } from "@shared-types/page-definitions/social-preview/app-state.social-preview.page-definition.types";
import type { AppContextSocialPreview } from "@shared-types/page-definitions/social-preview/app-context.social-preview.page-definition.types";

type AppContextResolveSocialPreviewInput = Readonly<{
  socialPreview: AppStateSocialPreview | null;
  origin: string;
  slug: string | null;
  siteName: string;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}>;

export const appContextResolveSocialPreview = ({
  socialPreview,
  origin,
  slug,
  siteName,
  image,
  imageWidth,
  imageHeight,
}: AppContextResolveSocialPreviewInput): AppContextSocialPreview | null => {
  if (socialPreview === null || slug === null) {
    return null;
  }

  return {
    ...socialPreview,
    siteName,
    url: `${origin}${slug}`,
    image,
    imageWidth: image ? imageWidth : null,
    imageHeight: image ? imageHeight : null,
  };
};
