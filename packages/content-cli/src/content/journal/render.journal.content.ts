// packages/content-cli/src/content/journal/render.journal.content.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export const renderJournalDraftFile = (
  journal: AuthoredPublicPageDefinition,
): string => {
  return `import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export const page:AuthoredPublicPageDefinition = ${JSON.stringify(
    journal,
    null,
    2,
  )} satisfies AuthoredPublicPageDefinition;
`;
};
