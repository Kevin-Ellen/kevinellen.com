// src/rendering/body-content/footer/footer.renderer.test.ts

import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

import { renderBodyContentFooter } from "@rendering/body-content/footer/footer.renderer";
import { renderJournalEntryFooter } from "@rendering/body-content/footer/journal-entry-footer.footer.renderer";

jest.mock(
  "@rendering/body-content/footer/journal-entry-footer.footer.renderer",
  () => ({
    renderJournalEntryFooter: jest.fn(),
  }),
);

const createFooter = (
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

describe("renderBodyContentFooter", () => {
  const mockedRenderJournalEntryFooter = jest.mocked(renderJournalEntryFooter);

  beforeEach(() => {
    jest.clearAllMocks();

    mockedRenderJournalEntryFooter.mockReturnValue(
      `<section>Journal entry footer</section>`,
    );
  });

  it("returns empty string when there are no footer modules", () => {
    expect(renderBodyContentFooter([])).toBe("");
    expect(mockedRenderJournalEntryFooter).not.toHaveBeenCalled();
  });

  it("renders footer modules inside article footer wrapper", () => {
    const footer = [createFooter()];

    expect(renderBodyContentFooter(footer)).toBe(
      `<footer class="l-content m-article-footer"><section>Journal entry footer</section></footer>`,
    );

    expect(mockedRenderJournalEntryFooter).toHaveBeenCalledWith(footer[0]);
  });

  it("renders multiple footer modules in order", () => {
    mockedRenderJournalEntryFooter
      .mockReturnValueOnce(`<section>First footer</section>`)
      .mockReturnValueOnce(`<section>Second footer</section>`);

    const footer = [
      createFooter(),
      createFooter({
        publication: {
          author: "Kevin Ellen",
          publishedAt: "11 May 2026",
          updatedAt: "12 May 2026",
        },
      }),
    ];

    expect(renderBodyContentFooter(footer)).toBe(
      `<footer class="l-content m-article-footer"><section>First footer</section><section>Second footer</section></footer>`,
    );

    expect(mockedRenderJournalEntryFooter).toHaveBeenNthCalledWith(
      1,
      footer[0],
    );
    expect(mockedRenderJournalEntryFooter).toHaveBeenNthCalledWith(
      2,
      footer[1],
    );
  });
});
