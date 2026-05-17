// shared-types/page-definitions/social-preview/app-render-context.social-preview.page-definition.types.ts

import type { AppContextSocialPreview } from "@shared-types/page-definitions/social-preview/app-context.social-preview.page-definition.types";
import type { TwitterCardType } from "@shared-types/page-definitions/social-preview/shared.social-preview.page-definition.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RenderFields = Readonly<{
  twitterCard: TwitterCardType;
}>;

export type AppRenderContextSocialPreview = Replace<
  AppContextSocialPreview,
  RenderFields
>;
