// src/app/appContext/appContext.types.ts

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetAuthored } from "@shared-types/assets/svg.asset.authored.types";
import type { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { StructuredDataNode } from "@shared-types/structured-data/structured-data.nodes.types";
import type { AppContextPageBodyContent } from "@app/appContext/content/content.appContext.types";

export type AppContextSvgReference = {
  type: "inline-svg";
  id: string;
};

export type AppContextRequest = {
  url: string;
  method: string;
  pathname: string;
};

export type AppContextPage = {
  id: string;
  kind: string;
  label: string;
};

export type AppContextMetadata = {
  title: string;
  description: string;
  canonicalUrl: string | null;
};

export type AppContextBreadcrumb = {
  id: string;
  label: string;
  href: string;
};

export type AppContextBranding = {
  homeHref: string;
  ariaLabel: string;
  logo: AppContextSvgReference;
};

export type AppContextSiteIdentity = {
  language: string;
  siteName: string;
};

type AppContextNavigationItemBase = {
  label: string;
  href: string;
  icon?: AppContextSvgReference;
  isExternal: boolean;
  openInNewTab: boolean;
};

export type AppContextNavigationPageItem = AppContextNavigationItemBase & {
  kind: "page";
  id: string;
  isCurrent: boolean;
};

export type AppContextNavigationSocialItem = AppContextNavigationItemBase & {
  kind: "social";
  id: string;
  isCurrent: false;
};

export type AppContextNavigationExternalItem = AppContextNavigationItemBase & {
  kind: "external";
  isCurrent: false;
};

export type AppContextNavigationItem =
  | AppContextNavigationPageItem
  | AppContextNavigationSocialItem
  | AppContextNavigationExternalItem;

export type AppContextFooterNavigationSection = {
  id: string;
  label: string;
  items: readonly AppContextNavigationItem[];
};

export type AppContextNavigation = {
  header: {
    primary: readonly AppContextNavigationItem[];
    social: readonly AppContextNavigationItem[];
  };
  footer: {
    sections: readonly AppContextFooterNavigationSection[];
  };
};

export type AppContextAssets = {
  scripts: readonly ScriptAssetAuthored[];
  svgs: readonly SvgAssetAuthored[];
};

export type AppContextFooterOrganisation = {
  href: string;
  label: string;
  iconClassName: string;
  svgId: string;
};

export type AppContextFooterColophonModule = {
  kind: "colophon";
  copyrightName: string;
  copyrightYear: number;
  allRightsReserved: boolean;
};

export type AppContextFooterAffiliationItem = {
  id: string;
  label: string;
  href: string;
  svgId: SvgAssetId;
};

export type AppContextFooterAffiliationsModule = {
  kind: "affiliations";
  title: string;
  description: string;
  items: readonly AppContextFooterAffiliationItem[];
};

export type AppContextFooterModule =
  | AppContextFooterColophonModule
  | AppContextFooterAffiliationsModule;

export type AppContextPageFooter = {
  modules: readonly AppContextFooterModule[];
};

export type AppContextStructuredDataItem = StructuredDataNode;

export type AppContextHeadIcons = {
  faviconIco: {
    href: string;
  };
  faviconSvg?: {
    href: string;
    type: "image/svg+xml";
  };
  faviconPng?: {
    href: string;
    type: "image/png";
    sizes: string;
  };
  appleTouchIcon: {
    href: string;
  };
  manifest: {
    href: string;
  };
};

export type AppContextPhotoId = string;

export type AppContextPhotoVariant = "frame" | "content";

export type AppContextPhoto = {
  id: string;
  title: string;
  alt: string;
  commentary: string;
  readableLocation: string | null;
  capturedAt: string | null;
  cameraModel: string | null;
  lensModel: string | null;
  exposureTime: number | null;
  aperture: number | null;
  iso: number | null;
  focalLength: number | null;
  intrinsic: {
    width: number;
    height: number;
  };
  image: {
    id: string;
    uploadedAt: string;
    urls: {
      frame: string;
      content: string;
    };
  };
};

export type AppContextPagination = {
  pageSize: number;
};

export type AppContextPhotoMetadataDefinition = {
  label: string;
  description?: string;
};

export type AppContextPhotoMetadataConfig = {
  location: AppContextPhotoMetadataDefinition;
  shutterSpeed: AppContextPhotoMetadataDefinition;
  aperture: AppContextPhotoMetadataDefinition;
  focalLength: AppContextPhotoMetadataDefinition;
  iso: AppContextPhotoMetadataDefinition;
};

export type AppContextModel = {
  request: AppContextRequest;
  target: DocumentRenderTarget;
  page: AppContextPage;
  metadata: AppContextMetadata;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  branding: AppContextBranding;
  siteIdentity: AppContextSiteIdentity;
  icons: AppContextHeadIcons;
  assets: AppContextAssets;
  pageFooter: AppContextPageFooter;
  structuredData: readonly AppContextStructuredDataItem[];
  content: AppContextPageBodyContent;
  photos: readonly AppContextPhoto[];
  photoMetadata: AppContextPhotoMetadataConfig;
};
