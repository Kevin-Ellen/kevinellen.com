// src/rendering/body-content/footer/footer.renderer.test.ts

import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

import { renderBodyContentFooter } from "@rendering/body-content/footer/footer.renderer";
import { renderJournalEntryFooter } from "@rendering/body-content/footer/journal-entry-footer/journal-entry-footer.footer.renderer";
import { renderNoteEntryFooter } from "@rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.renderer";

jest.mock(
  "@rendering/body-content/footer/journal-entry-footer/journal-entry-footer.footer.renderer",
  () => ({
    renderJournalEntryFooter: jest.fn(),
  }),
);

jest.mock(
  "@rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.renderer",
  () => ({
    renderNoteEntryFooter: jest.fn(),
  }),
);

const createJournalFooter = (
  overrides: Partial<AppRenderContextPageContentFooter> = {},
): AppRenderContextPageContentFooter =>
  ({
    kind: "journalEntryFooter",
    publication: {
      author: "Kevin Ellen",
      publishedAt: "9 May 2026",
      updatedAt: "10 May 2026",
    },
    equipment: {
      cameras: [],
      lenses: [],
    },
    tags: [],
    ...overrides,
  }) as AppRenderContextPageContentFooter;

const createNoteFooter = (
  overrides: Partial<AppRenderContextPageContentFooter> = {},
): AppRenderContextPageContentFooter =>
  ({
    kind: "noteEntryFooter",
    publication: {
      author: "Kevin Ellen",
      publishedAt: "10 May 2026",
      updatedAt: "11 May 2026",
    },
    topic: "Architecture",
    tags: ["typescript"],
    ...overrides,
  }) as AppRenderContextPageContentFooter;

describe("renderBodyContentFooter", () => {
  const mockedRenderJournalEntryFooter = jest.mocked(renderJournalEntryFooter);
  const mockedRenderNoteEntryFooter = jest.mocked(renderNoteEntryFooter);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderJournalEntryFooter.mockReturnValue(
      `<section>Journal entry footer</section>`,
    );

    mockedRenderNoteEntryFooter.mockReturnValue(
      `<section>Note entry footer</section>`,
    );
  });

  it("returns empty string when there are no footer modules", () => {
    expect(renderBodyContentFooter([])).toBe("");
    expect(mockedRenderJournalEntryFooter).not.toHaveBeenCalled();
    expect(mockedRenderNoteEntryFooter).not.toHaveBeenCalled();
  });

  it("renders journal footer modules inside article footer wrapper", () => {
    const footer = [createJournalFooter()];

    expect(renderBodyContentFooter(footer)).toBe(
      `<footer class="l-content m-article-footer"><section>Journal entry footer</section></footer>`,
    );

    expect(mockedRenderJournalEntryFooter).toHaveBeenCalledWith(footer[0]);
    expect(mockedRenderNoteEntryFooter).not.toHaveBeenCalled();
  });

  it("renders note footer modules inside article footer wrapper", () => {
    const footer = [createNoteFooter()];

    expect(renderBodyContentFooter(footer)).toBe(
      `<footer class="l-content m-article-footer"><section>Note entry footer</section></footer>`,
    );

    expect(mockedRenderNoteEntryFooter).toHaveBeenCalledWith(footer[0]);
    expect(mockedRenderJournalEntryFooter).not.toHaveBeenCalled();
  });

  it("renders multiple footer modules in order", () => {
    mockedRenderJournalEntryFooter.mockReturnValueOnce(
      `<section>First footer</section>`,
    );

    mockedRenderNoteEntryFooter.mockReturnValueOnce(
      `<section>Second footer</section>`,
    );

    const footer = [createJournalFooter(), createNoteFooter()];

    expect(renderBodyContentFooter(footer)).toBe(
      `<footer class="l-content m-article-footer"><section>First footer</section><section>Second footer</section></footer>`,
    );

    expect(mockedRenderJournalEntryFooter).toHaveBeenCalledWith(footer[0]);
    expect(mockedRenderNoteEntryFooter).toHaveBeenCalledWith(footer[1]);
  });
});
