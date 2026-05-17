// packages/content-cli/src/content/notes/render.note.content.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export const renderNoteDraftFile = (
  note: AuthoredPublicPageDefinition,
): string => {
  return `import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

export const page: AuthoredPublicPageDefinition = ${JSON.stringify(
    note,
    null,
    2,
  )} satisfies AuthoredPublicPageDefinition;
`;
};
