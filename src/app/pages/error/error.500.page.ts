// src/app/pages/error/error.500.page.ts

import type {
  AppPage,
  DocFooter,
  DocHead,
  PageConfig,
  PageContent,
  PageDefinition,
  PageHead,
  Breadcrumbs,
  StructuredDataNode,
  DocScript,
} from "@types-src/appPage.types";

const definition: PageDefinition = {
  id: "error-500",
  kind: "static",
  slug: "/",
  renderMode: "bundled",
};

const config: PageConfig = {
  robots: {
    allowIndex: false,
    allowFollow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  robotsTxt: {
    disallow: false,
  },
  sitemap: {
    include: false,
  },
};

const breadcrumbs: Breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Server Error", href: "/" },
];

const docHead: DocHead = {
  pageTitle: "Server Error | Kevin Ellen",
  metaDescription: "Something went wrong while trying to load this page.",
};

const content: PageContent = {
  head: {
    eyebrow: "Error 500",
    title: "Something went wrong",
    intro:
      "An unexpected error occurred while loading this page. Please try again in a moment.",
  },
  body: [],
  footer: [],
};

const pageScripts: DocScript[] = [];
const pageInlineSvgSprite: string[] = [];
const pageStructuredData: StructuredDataNode[] = [];

const pageHead: PageHead = {
  breadcrumbs,
};

const docFooter: DocFooter = {
  scripts: pageScripts,
  inlineSvgSprite: pageInlineSvgSprite,
  structuredData: pageStructuredData,
};

const error500Page: AppPage = {
  definition,
  config,
  docHead,
  pageHead,
  content,
  docFooter,
  status: 500,
};

export default error500Page;
