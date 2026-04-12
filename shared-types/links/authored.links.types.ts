// shared-types/links/authored.links.types.ts

import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { SocialId } from "@shared-types/config/social/id.social.types";
import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";
import type { LinkOpenBehaviour } from "@shared-types/links/shared.links.types";

type AuthoredInternalLink = {
  kind: "internal";
  id: PageIdPublic;
  svgId?: SvgAssetId;
  behaviour?: LinkOpenBehaviour;
};

type AuthoredSocialLink = {
  kind: "social";
  id: SocialId;
  svgId?: SvgAssetId;
  behaviour?: {
    openInNewTab: true;
  };
};

type AuthoredExternalLink = {
  kind: "external";
  href: string;
  label: string;
  svgId?: SvgAssetId;
  behaviour?: {
    openInNewTab: true;
  };
};

export type AuthoredLink =
  | AuthoredInternalLink
  | AuthoredSocialLink
  | AuthoredExternalLink;
