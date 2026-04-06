// packages/shared-types/src/content/pages/public/about-technology/technology.about.public.page.content.ts

import type { ContentSectionAuthored } from "@shared-types/content/content-section/content.section.module.types";
import type { PageHeadAuthored } from "@shared-types/content/page-head/page.head.types";

export type TechnologyAboutPageContentAuthored = {
  head: PageHeadAuthored;
  body: readonly ContentSectionAuthored[];
  footer: readonly string[];
};
