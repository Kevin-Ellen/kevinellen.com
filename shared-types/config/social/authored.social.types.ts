// shared-types/config/social/authored.social.types.ts

import type { SocialId } from "@shared-types/config/social/id.social.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

export type AuthoredSocialItem<TId extends SocialId = SocialId> = Readonly<{
  id: TId;
  label: string;
  href: string;
  svgId: SvgAssetId;
}>;

export type AuthoredSocial = Readonly<{
  [K in SocialId]: AuthoredSocialItem<K>;
}>;
