// src/app/renderContext/renderContext.types.ts

import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { StructuredDataNode } from "@shared-types/structured-data/structured-data.nodes.types";
import type { RenderContextPageBodyContent } from "@app/renderContext/content/content.renderContext.types";
import type { PhotoVariant } from "@app/appContext/appContext.types";

export type RenderContextSvgAsset = {
  id: SvgAssetId;
  viewBox: string;
  content: string;
  width: number;
  height: number;
};

export type RenderContextDocument = {
  status: number;
  language: string;
  siteName: string;
};

export type RenderContextPage = {
  id: string;
  kind: string;
  label: string;
};

export type RenderContextMetadata = {
  title: string;
  description: string;
  canonicalUrl: string | null;
};

export type RenderContextSecurity = {
  nonce: string;
};

export type RenderContextHeadIcons = {
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

export type RenderContextHead = {
  scripts: readonly ScriptAssetAuthored[];
  icons: RenderContextHeadIcons;
};

export type RenderContextFooter = {
  scripts: readonly ScriptAssetAuthored[];
  svgs: readonly RenderContextSvgAsset[];
};

export type RenderContextStructuredData = {
  items: readonly StructuredDataNode[];
};

export type RenderContextSvgReference = {
  id: SvgAssetId;
  width: number;
  height: number;
};

export type RenderContextBreadcrumb = {
  id: string;
  label: string;
  href: string;
};

export type RenderContextNavigationItem = {
  kind: "page" | "social" | "external";
  id?: string;
  label: string;
  href: string;
  isCurrent: boolean;
  isExternal: boolean;
  openInNewTab: boolean;
  icon?: RenderContextSvgReference;
};

export type RenderContextHeaderBranding = {
  href: string;
  ariaLabel: string;
  logo: RenderContextSvgReference;
};

export type RenderContextHeader = {
  branding: RenderContextHeaderBranding;
  navigation: {
    primary: readonly RenderContextNavigationItem[];
    social: readonly RenderContextNavigationItem[];
  };
  breadcrumbs: readonly RenderContextBreadcrumb[];
};

export type RenderContextFooterNavigationItem = {
  label: string;
  href: string;
  isExternal: boolean;
  openInNewTab: boolean;
};

export type RenderContextFooterNavigationSection = {
  id: string;
  label: string;
  items: readonly RenderContextFooterNavigationItem[];
};

export type RenderContextPageFooterAffiliationItem = {
  href: string;
  label: string;
  svg: RenderContextSvgReference;
};

export type RenderContextPageFooter = {
  navigation: {
    sections: readonly RenderContextFooterNavigationSection[];
  };
  affiliations: {
    title: string;
    description: string;
    items: readonly RenderContextPageFooterAffiliationItem[];
  } | null;
  colophon: {
    copyrightYear: number;
    copyrightName: string;
    allRightsReserved: boolean;
  } | null;
};

export type RenderContextPhotoId = string;

export type RenderContextPhoto = {
  id: string;
  title: string;
  alt: string;
  commentary: string;
  readableLocation?: string;
  capturedAt?: string;
  cameraModel?: string;
  lensModel?: string;
  exposureTime?: number;
  aperture?: number;
  iso?: number;
  focalLength?: number;
  intrinsic: {
    width: number;
    height: number;
  };
  image: {
    id: string;
    filename: string;
    uploadedAt: string;
    variants: readonly PhotoVariant[];
    urls: Record<PhotoVariant, string>;
  };
};

export type RenderContextModel = {
  document: RenderContextDocument;
  page: RenderContextPage;
  metadata: RenderContextMetadata;
  head: RenderContextHead;
  header: RenderContextHeader;
  pageFooter: RenderContextPageFooter;
  footer: RenderContextFooter;
  structuredData: RenderContextStructuredData;
  security: RenderContextSecurity;
  content: RenderContextPageBodyContent;
  photos: readonly RenderContextPhoto[];
};
