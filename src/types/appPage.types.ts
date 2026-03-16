// src/types/appPage.types.ts

import type { WithContext, Thing } from "schema-dts";

export type DocScriptLocation = "head" | "footer";

export type DocScript =
  | {
      kind: "inline";
      content: string;
      type?: string;
      location: DocScriptLocation;
    }
  | {
      kind: "external";
      src: string;
      type?: string;
      defer?: boolean;
      async?: boolean;
      location: DocScriptLocation;
    };

export type StructuredDataNode = WithContext<Thing>;

export type PageKind =
  | "home"
  | "static"
  | "listing"
  | "article"
  | "photo"
  | "tag";

export type PageRenderMode = "bundled" | "request-composed";

export type PageDefinition = {
  id: string;
  kind: PageKind;
  slug: string;
  renderMode: PageRenderMode;
};

export type StructuredDataFlags = {
  breadcrumbs?: boolean;
  webPage?: boolean;
  article?: boolean;
  imageObject?: boolean;
  collectionPage?: boolean;
};

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type Breadcrumbs = BreadcrumbItem[];

export type PageConfig = {
  robots: {
    allowIndex: boolean;
    allowFollow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    noimageindex: boolean;
  };
  robotsTxt: {
    disallow: boolean;
  };
  sitemap: {
    include: boolean;
  };
  structuredData?: StructuredDataFlags;
};

export type DocHead = {
  pageTitle: string;
  metaDescription: string;
};

export type PageHead = {
  breadcrumbs: Breadcrumbs;
};

export type PageContent = {
  head: {
    title: string;
    intro: string;
    eyebrow: string;
  };
  body: string[];
  footer: string[];
};

export type DocFooter = {
  scripts: DocScript[];
  inlineSvgSprite: string[];
  structuredData: StructuredDataNode[];
};

export type AppPage = {
  definition: PageDefinition;
  config: PageConfig;
  docHead: DocHead;
  pageHead: PageHead;
  content: PageContent;
  docFooter: DocFooter;
  status: 200 | 404 | 500;
};

export type AppRouteMap = Record<string, AppPage>;
