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
  id: "error-404",
  kind: "static",
  slug: "/404",
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
  pageTitle: "Client Error | Kevin Ellen",
  metaDescription: "This page does not exist.",
};

const content: PageContent = {
  head: {
    eyebrow: "Error 404",
    title: "Something couldn't be found",
    intro: "This page cannot be found.",
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

const error404page: AppPage = {
  definition,
  config,
  docHead,
  pageHead,
  content,
  docFooter,
  status: 404,
};

export default error404page;
