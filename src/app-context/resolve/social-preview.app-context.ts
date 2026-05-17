// src/app-context/resolve/social-preview.app-context.ts

import type { AppStateSocialPreview } from "@shared-types/page-definitions/social-preview/app-state.social-preview.page-definition.types";
import type { AppContextSocialPreview } from "@shared-types/page-definitions/social-preview/app-context.social-preview.page-definition.types";

type AppContextResolveSocialPreviewInput = Readonly<{
  socialPreview: AppStateSocialPreview | null;
  origin: string;
  slug: string | null;
  image: string | null;
}>;

export const appContextResolveSocialPreview = ({
  socialPreview,
  origin,
  slug,
  image,
}: AppContextResolveSocialPreviewInput): AppContextSocialPreview | null => {
  if (socialPreview === null) {
    return null;
  }

  return {
    ...socialPreview,
    url: slug ? `${origin}${slug}` : null,
    image,
  };
};
