// src/app/pages/journal.page.ts

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
  id: "journal",
  kind: "listing",
  slug: "/journal",
  renderMode: "request-composed",
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
  { label: "Journal", href: "/journal" },
];

const docHead: DocHead = {
  pageTitle: "Journal | Kevin Ellen",
  metaDescription:
    "Read journal entries, articles, and field notes covering photography, places, observations, and technical thinking.",
};

const content: PageContent = {
  head: {
    eyebrow: "Journal",
    title: "Writing, notes, and observations",
    intro:
      "The journal will bring together articles, field notes, travel reflections, and slower written pieces from across the site.",
  },
  body: [
    `
    <section>
      <p>
        This is the journal landing page. It will become an aggregated listing
        of written content pulled together at request time.
      </p>
    </section>
    `,
  ],
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

const journalPage: AppPage = {
  definition,
  config,
  docHead,
  pageHead,
  content,
  docFooter,
  status: 200,
};

export default journalPage;
