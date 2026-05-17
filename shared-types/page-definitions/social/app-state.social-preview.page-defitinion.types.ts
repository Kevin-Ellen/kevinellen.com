// shared-types/page-definitions/social/app-state.social.page-defitinion.types.ts

export type AppStateSocialPreview = Readonly<{
  openGraphType: "website" | "article";
  image: string | null;
  title: string;
  description: string;
}>;
