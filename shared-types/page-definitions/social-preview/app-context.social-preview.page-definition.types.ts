// shared-types/page-definitions/social-preview/app-context.social-preview.page-definition.types.ts

import type { AppStateSocialPreview } from "@shared-types/page-definitions/social-preview/app-state.social-preview.page-definition.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  image: string | null;
  url: string | null;
}>;

export type AppContextSocialPreview = Replace<
  AppStateSocialPreview,
  RuntimeFields
>;
