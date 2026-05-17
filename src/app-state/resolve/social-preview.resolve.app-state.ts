// src/app-state/resolve/social-preview.resolve.app-state.ts

import type { PageMetadata } from "@shared-types/page-definitions/shared/shared.metadata.page-definition.types";
import type { AuthoredSocialPreview } from "@shared-types/page-definitions/social-preview/authored.social-preview.page-definition.types";
import type { AppStateSocialPreview } from "@shared-types/page-definitions/social-preview/app-state.social-preview.page-definition.types";

export const appStateResolveSocialPreview = ({
  metadata,
  social,
}: {
  metadata: PageMetadata;
  social?: AuthoredSocialPreview;
}): AppStateSocialPreview => ({
  openGraphType: social?.openGraphType ?? "website",

  image: social?.image ?? null,

  title: social?.title ?? metadata.pageTitle,

  description: social?.description ?? metadata.metaDescription,
});
