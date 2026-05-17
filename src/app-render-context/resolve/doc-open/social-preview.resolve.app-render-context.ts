// src/app-render-context/resolve/doc-open/social-preview.resolve.app-render-context.ts

import type { AppContextSocialPreview } from "@shared-types/page-definitions/social-preview/app-context.social-preview.page-definition.types";
import type { AppRenderContextSocialPreview } from "@shared-types/page-definitions/social-preview/app-render-context.social-preview.page-definition.types";

export const appRenderContextResolveSocialPreview = (
  socialPreview: AppContextSocialPreview | null,
): AppRenderContextSocialPreview | null => {
  if (socialPreview === null) {
    return null;
  }

  return {
    ...socialPreview,
    twitterCard: "summary_large_image",
  };
};
