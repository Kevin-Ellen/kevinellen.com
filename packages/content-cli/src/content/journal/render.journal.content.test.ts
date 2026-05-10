// packages/content-cli/src/content/journal/render.journal.content.test.ts

import { renderJournalDraftFile } from "@content-cli/content/journal/render.journal.content";

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

describe("renderJournalDraftFile", () => {
  it("renders a journal draft file correctly", () => {
    const journal: AuthoredPublicPageDefinition = {
      id: "journal:rye-house",
      kind: "journal",
      slug: "/journal/rye-house",
      label: "Rye House",
      metadata: {
        pageTitle: "Rye House",
        metaDescription: "Test",
      },
      breadcrumbs: ["home", "journal"],
      content: {
        head: {
          title: "Rye House",
        },
        content: [],
        footer: [],
      },
    };

    const output = renderJournalDraftFile(journal);

    expect(output).toContain(
      `export const page: AuthoredPublicPageDefinition =`,
    );
    expect(output).toContain(`"id": "journal:rye-house"`);
    expect(output).toContain(`"kind": "journal"`);
    expect(output).toContain(`satisfies AuthoredPublicPageDefinition;`);
  });
});
