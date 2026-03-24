// src/config/social.config.types.ts

import type { SvgAssetId } from "@config/assets.config.types";

export type SocialId = "github" | "linkedin" | "instagram";
export type IconId = string;

export type SocialItem<TId extends SocialId = SocialId> = {
  id: TId;
  label: string;
  href: string;
  svgId: SvgAssetId;
};

export type SocialConfig = {
  [K in SocialId]: SocialItem<K>;
};
