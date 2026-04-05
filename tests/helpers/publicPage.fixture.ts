// tests/helpers/publicPage.fixture.ts
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";

export const createPublicPageFixture = (
  overrides: Partial<PublicPage> = {},
): PublicPage => {
  return {
    core: {
      id: "home",
      kind: "home",
      label: "Home",
      slug: "/",
    },
    config: {
      allowIndex: true,
      allowFollow: true,
      robotsAllow: true,
      xmlSitemap: true,
    },
    meta: {
      pageTitle: "Home",
      metaDescription: "Home page",
    },
    breadcrumbs: [],
    content: {
      // real minimum shape for this page kind
    },
    assets: {
      scripts: [],
      svgs: [],
    },
    ...overrides,
  } as PublicPage;
};
