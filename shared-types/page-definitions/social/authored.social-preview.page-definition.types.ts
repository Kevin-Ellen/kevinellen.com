// shared-types/page-definitions/social/authored.social-preview.page-definition.types.ts

export type AuthoredOpenGraphType = "website" | "article";

export type AuthoredSocialPreview = Readonly<{
  openGraphType?: AuthoredOpenGraphType;
  image?: string;
  title?: string;
  description?: string;
}>;
