// packages/content-cli/src/content/journal/draft.create.journal.content.test.ts

import { createDraftJournalDefinition } from "@content-cli/content/journal/draft.create.journal.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

jest.mock("@content-cli/utils/format.local.date.time.with.offset.util");

const mockedFormatLocalDateTimeWithOffset = jest.mocked(
  formatLocalDateTimeWithOffset,
);

const getArticleSection = (
  result: ReturnType<typeof createDraftJournalDefinition>,
  index: number,
) => {
  const block = result.content.content[index];

  if (block.kind !== "articleSection") {
    throw new Error(`Expected articleSection at index ${index}`);
  }

  return block;
};

const getFooter = (result: ReturnType<typeof createDraftJournalDefinition>) => {
  const footer = result.content.footer?.[0];

  if (!footer) {
    throw new Error("Expected journal footer");
  }

  return footer;
};

describe("createDraftJournalDefinition", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedFormatLocalDateTimeWithOffset.mockReturnValue(
      "2026-05-10T12:00:00+01:00",
    );
  });

  it("creates a journal definition with the workspace slug", () => {
    const result = createDraftJournalDefinition("my-journal", null);

    expect(result.slug).toBe("/journal/my-journal");
  });

  it("includes a hero module when a first photo ID is provided", () => {
    const result = createDraftJournalDefinition("my-journal", "photo-1");

    const featuredSection = getArticleSection(result, 0);

    expect(featuredSection.modules).toEqual([
      {
        kind: "hero",
        photoId: "photo-1",
        immersive: true,
      },
    ]);
  });

  it("creates an empty featured image section when no photo is provided", () => {
    const result = createDraftJournalDefinition("my-journal", null);

    const featuredSection = getArticleSection(result, 0);

    expect(featuredSection.modules).toEqual([]);
  });

  it("reuses publishedAt for updatedAt", () => {
    const result = createDraftJournalDefinition("my-journal", null);

    const footer = getFooter(result);

    expect(footer).toEqual({
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2026-05-10T12:00:00+01:00",
        updatedAt: ["2026-05-10T12:00:00+01:00"],
      },
      tags: [],
    });
  });
});
