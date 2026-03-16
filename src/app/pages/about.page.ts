// src/app/pages/about.page.ts

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
  id: "about",
  kind: "static",
  slug: "/about",
  renderMode: "bundled",
};

const config: PageConfig = {
  robots: {
    allowIndex: true,
    allowFollow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  },
  robotsTxt: {
    disallow: false,
  },
  sitemap: {
    include: true,
  },
};

const breadcrumbs: Breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

const docHead: DocHead = {
  pageTitle: "About | Kevin Ellen",
  metaDescription:
    "Learn more about Kevin Ellen, his work, photography, writing, and the thinking behind the site.",
};

const content: PageContent = {
  head: {
    eyebrow: "About",
    title: "A little about me",
    intro:
      "This page will introduce who I am, the work I do, the things I care about, and how photography, writing, and technology meet on this platform.",
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

const aboutPage: AppPage = {
  definition,
  config,
  docHead,
  pageHead,
  content,
  docFooter,
  status: 200,
};

export default aboutPage;
