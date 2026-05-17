// shared-types/page-definitions/social-preview/app-context.social-preview.page-definition.types.ts

import type { AppStateSocialPreview } from "@shared-types/page-definitions/social-preview/app-state.social-preview.page-definition.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  siteName: string;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  url: string;
}>;

export type AppContextSocialPreview = Replace<
  AppStateSocialPreview,
  RuntimeFields
>;
