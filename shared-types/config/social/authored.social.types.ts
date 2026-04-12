// shared-types/config/social/authored.social.types.ts

import { SocialId } from "@shared-types/config/social/id.social.types";
import { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

export type AuthoredSocialItem<TId extends SocialId = SocialId> = {
  id: TId;
  label: string;
  href: string;
  svgId: SvgAssetId;
};

export type AuthoredSocial = {
  [K in SocialId]: AuthoredSocialItem<K>;
};
