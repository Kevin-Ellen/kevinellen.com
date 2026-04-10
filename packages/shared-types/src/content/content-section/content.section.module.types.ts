// packages/shared-types/src/content/content.section.module.types.ts

import type { ContentModuleAuthored } from "@shared-types/content/modules/index.content.module.types";

export type ContentSectionAuthored = {
  kind: "contentSection";
  heading?: {
    text: string;
    visuallyHidden?: boolean;
    level: 2 | 3 | 4 | 5 | 6;
  };
  modules: readonly ContentModuleAuthored[];
};
