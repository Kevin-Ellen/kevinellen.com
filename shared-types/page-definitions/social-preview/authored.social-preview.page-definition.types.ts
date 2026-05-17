// shared-types/page-definitions/social-preview/authored.social-preview.page-definition.types.ts

import type { OpenGraphType } from "@shared-types/page-definitions/social-preview/shared.social-preview.page-definition.types";

export type AuthoredSocialPreview = Readonly<{
  openGraphType?: OpenGraphType;
  image?: string;
  title?: string;
  description?: string;
}>;
