// src/config/navigation.config.types.ts

import type { SocialId } from "@config/social.config.types";
import type { SvgAssetId } from "@shared-types/config/assets.config.types";
import type { PageId } from "@shared-types/pages/definitions/base.definition.page";

export type NavigationItem =
  | { kind: "page"; id: PageId; svgId?: SvgAssetId }
  | { kind: "social"; id: SocialId; svgId?: SvgAssetId }
  | { kind: "external"; href: string; label: string; svgId?: SvgAssetId };

export type FooterNavigationSection = {
  id: string;
  label: string;
  items: readonly NavigationItem[];
};

export type NavigationConfig = {
  header: {
    primary: readonly NavigationItem[];
    social: readonly NavigationItem[];
  };
  footer: {
    sections: readonly FooterNavigationSection[];
  };
};
