// shared-types/links/authored.links.types.ts

import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { SocialId } from "@shared-types/config/social/id.social.types";
import type { PageIdPublic } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";
import type { LinkOpenBehaviour } from "@shared-types/links/shared.links.types";

export type AuthoredInternalLink = Readonly<{
  kind: "internal";
  id: PageIdPublic;
  svgId?: SvgAssetId;
  behaviour?: LinkOpenBehaviour;
}>;

export type AuthoredSocialLink = Readonly<{
  kind: "social";
  id: SocialId;
  svgId?: SvgAssetId;
}>;

export type AuthoredExternalLink = Readonly<{
  kind: "external";
  href: string;
  text: string;
  svgId?: SvgAssetId;
}>;

export type AuthoredLink =
  | AuthoredInternalLink
  | AuthoredSocialLink
  | AuthoredExternalLink;
