// test/helpers/page.content.fixture.ts

import type { PageContent } from "@app/pages/content/content.page.types";

export const createPageContentFixture = (): PageContent => ({
  head: {
    eyebrow: "Test eyebrow",
    title: "Test title",
    intro: "Test intro",
  },
  body: [],
  footer: [],
});
