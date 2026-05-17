// shared-types/page-definitions/social-preview/app-state.social-preview.page-definition.types.ts

import type { OpenGraphType } from "@shared-types/page-definitions/social-preview/shared.social-preview.page-definition.types";
import type { AuthoredSocialPreview } from "@shared-types/page-definitions/social-preview/authored.social-preview.page-definition.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  openGraphType: OpenGraphType;
  image: string | null;
  title: string;
  description: string;
}>;

export type AppStateSocialPreview = Replace<
  AuthoredSocialPreview,
  DeterministicFields
>;
