// tests/src/rendering/body-content/footer/footer.body-content.renderer.test.ts

import { renderBodyContentFooter } from "@rendering/body-content/footer/footer.body-content.renderer";
import { renderJournalEntryFooterModule } from "@rendering/body-content/footer/journal-entry-footer.body-content.renderer";

jest.mock(
  "@rendering/body-content/footer/journal-entry-footer.body-content.renderer",
  () => ({
    renderJournalEntryFooterModule: jest.fn(),
  }),
);

describe("renderBodyContentFooter", () => {
  const mockedRenderJournalEntryFooterModule = jest.mocked(
    renderJournalEntryFooterModule,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an empty string when there are no footer modules", () => {
    expect(renderBodyContentFooter([])).toBe("");
    expect(mockedRenderJournalEntryFooterModule).not.toHaveBeenCalled();
  });

  it("renders journal entry footer modules inside the article footer wrapper", () => {
    const module = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "27 May 2025",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    } as never;

    mockedRenderJournalEntryFooterModule.mockReturnValue(
      `<section>Rendered footer</section>`,
    );

    const html = renderBodyContentFooter([module]);

    expect(mockedRenderJournalEntryFooterModule).toHaveBeenCalledWith(module);
    expect(html).toContain(`<footer class="l-content m-article-footer">`);
    expect(html).toContain(`<section>Rendered footer</section>`);
    expect(html).toContain(`</footer>`);
  });
});
