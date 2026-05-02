// tests/src/rendering/body-content/footer/journal-entry-footer.body-content.renderer.test.ts

import { renderJournalEntryFooterModule } from "@rendering/body-content/footer/journal-entry-footer.body-content.renderer";

const createFooterModule = (overrides = {}) =>
  ({
    kind: "journalEntryFooter",
    publication: {
      author: "Kevin Ellen",
      publishedAt: "27 May 2025",
      updatedAt: ["28 May 2025"],
    },
    tags: ["Mallorca", "Birds"],
    equipment: {
      cameras: ["Canon EOS R7"],
      lenses: ["RF100-500mm F4.5-7.1 L IS USM"],
    },
    ...overrides,
  }) as never;

describe("renderJournalEntryFooterModule", () => {
  it("renders publication details", () => {
    const html = renderJournalEntryFooterModule(createFooterModule());

    expect(html).toContain(
      `<h3 class="m-article-footer__heading">Publication</h3>`,
    );
    expect(html).toContain(`Written by`);
    expect(html).toContain(`Kevin Ellen`);
    expect(html).toContain(`Published`);
    expect(html).toContain(`27 May 2025`);
    expect(html).toContain(`Last updated`);
    expect(html).toContain(`28 May 2025`);
  });

  it("falls back to published date when there are no updated dates", () => {
    const html = renderJournalEntryFooterModule(
      createFooterModule({
        publication: {
          author: "Kevin Ellen",
          publishedAt: "27 May 2025",
          updatedAt: [],
        },
      }),
    );

    expect(html).toContain(`Last updated`);
    expect(html).toContain(`27 May 2025`);
  });

  it("renders camera and lens field notes", () => {
    const html = renderJournalEntryFooterModule(createFooterModule());

    expect(html).toContain(
      `<h3 class="m-article-footer__heading">Field notes</h3>`,
    );
    expect(html).toContain(`Camera`);
    expect(html).toContain(`Canon EOS R7`);
    expect(html).toContain(`Lens`);
    expect(html).toContain(`RF100-500mm F4.5-7.1 L IS USM`);
  });

  it("omits empty camera and lens rows cleanly", () => {
    const html = renderJournalEntryFooterModule(
      createFooterModule({
        equipment: {
          cameras: [],
          lenses: [],
        },
      }),
    );

    expect(html).toContain(`Field notes`);
    expect(html).not.toContain(`Camera</dt>`);
    expect(html).not.toContain(`Lens</dt>`);
  });

  it("escapes rendered footer values", () => {
    const html = renderJournalEntryFooterModule(
      createFooterModule({
        publication: {
          author: `Kevin <Duck> & Co`,
          publishedAt: `27 May <2025>`,
          updatedAt: [`28 May & 2025`],
        },
        equipment: {
          cameras: [`Canon <EOS R7>`],
          lenses: [`RF100-500mm & friends`],
        },
      }),
    );

    expect(html).toContain(`Kevin &lt;Duck&gt; &amp; Co`);
    expect(html).toContain(`27 May &lt;2025&gt;`);
    expect(html).toContain(`28 May &amp; 2025`);
    expect(html).toContain(`Canon &lt;EOS R7&gt;`);
    expect(html).toContain(`RF100-500mm &amp; friends`);
  });
});
