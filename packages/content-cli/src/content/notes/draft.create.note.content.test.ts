// packages/content-cli/src/content/notes/draft.create.note.content.test.ts

import { createDraftNoteDefinition } from "@content-cli/content/notes/draft.create.note.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

jest.mock("@content-cli/utils/format.local.date.time.with.offset.util", () => ({
  formatLocalDateTimeWithOffset: jest.fn(),
}));

describe("createDraftNoteDefinition", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(formatLocalDateTimeWithOffset)
      .mockReturnValue("2026-05-10T23:03:37+01:00");
  });

  it("creates a draft note definition with required placeholders", () => {
    const result = createDraftNoteDefinition("my-note");

    expect(result).toEqual({
      id: "note:__REQUIRED__",
      kind: "note",
      slug: "/notes/my-note",
      label: "__REQUIRED__",
      metadata: {
        pageTitle: "__REQUIRED__",
        metaDescription: "__REQUIRED__",
      },
      socialPreview: {
        openGraphType: "article",
      },
      breadcrumbs: ["home"],
      content: {
        head: {
          eyebrow: "Note",
          title: "__REQUIRED__",
          intro: "__REQUIRED__",
        },
        content: [
          {
            kind: "articleSection",
            heading: {
              text: "Introduction",
              visuallyHidden: true,
              level: 2,
            },
            modules: [
              {
                kind: "paragraph",
                content: [
                  {
                    kind: "text",
                    value: "__REQUIRED__",
                  },
                ],
              },
            ],
          },
        ],
        footer: [
          {
            kind: "noteEntryFooter",
            publication: {
              author: "Kevin Ellen",
              publishedAt: "2026-05-10T23:03:37+01:00",
              updatedAt: ["2026-05-10T23:03:37+01:00"],
            },
            topic: "__REQUIRED__",
            tags: [],
          },
        ],
      },
    });
  });

  it("uses the current formatted local timestamp for publication dates", () => {
    createDraftNoteDefinition("my-note");

    expect(formatLocalDateTimeWithOffset).toHaveBeenCalledWith(
      expect.any(Date),
    );
  });
});
