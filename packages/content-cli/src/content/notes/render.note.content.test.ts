// packages/content-cli/src/content/notes/render.note.content.test.ts

import { renderNoteDraftFile } from "@content-cli/content/notes/render.note.content";

describe("renderNoteDraftFile", () => {
  it("renders a note draft TypeScript file", () => {
    const result = renderNoteDraftFile({
      id: "note:my-note",
      kind: "note",
      slug: "/notes/my-note",
      label: "My Note",
      metadata: {
        pageTitle: "My Note",
        metaDescription: "My note description.",
      },
      breadcrumbs: ["home"],
      content: {
        head: {
          eyebrow: "Note",
          title: "My Note",
          intro: "Intro.",
        },
        content: [],
      },
    });

    expect(result).toContain(
      'import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";',
    );

    expect(result).toContain(
      "export const page: AuthoredPublicPageDefinition =",
    );

    expect(result).toContain('"id": "note:my-note"');
    expect(result).toContain("satisfies AuthoredPublicPageDefinition;");
  });
});
