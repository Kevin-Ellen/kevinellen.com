// src/config/navigation.config.types.ts

import type { SocialId } from "@config/social.config.types";
import type { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { PageId } from "@shared-types/content/pages/base.page.definition";

type NavigationBehaviour = {
  openInNewTab?: boolean;
};

export type NavigationItem =
  | ({ kind: "page"; id: PageId; svgId?: SvgAssetId } & NavigationBehaviour)
  | ({ kind: "social"; id: SocialId; svgId?: SvgAssetId } & NavigationBehaviour)
  | ({
      kind: "external";
      href: string;
      label: string;
      svgId?: SvgAssetId;
    } & NavigationBehaviour);

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
