// src/rendering/body-content/footer/journal-entry-footer.footer.renderer.test.ts

import type { AppRenderContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.types";

import { renderJournalEntryFooter } from "@rendering/body-content/footer/journal-entry-footer.footer.renderer";

const createModule = (
  overrides: Partial<AppRenderContextJournalEntryFooter> = {},
): AppRenderContextJournalEntryFooter =>
  ({
    kind: "journalEntryFooter",
    publication: {
      author: "Kevin Ellen",
      publishedAt: "9 May 2026",
      updatedAt: "10 May 2026",
    },
    equipment: {
      cameras: ["Canon EOS R7"],
      lenses: ["Canon RF 100-500mm"],
    },
    ...overrides,
  }) as AppRenderContextJournalEntryFooter;

describe("renderJournalEntryFooter", () => {
  it("renders publication and field notes footer groups", () => {
    expect(renderJournalEntryFooter(createModule())).toBe(
      `<section class="m-article-footer__group"><h3 class="m-article-footer__heading">Publication</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Written by</dt><dd class="m-article-footer__value">Kevin Ellen</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Published</dt><dd class="m-article-footer__value">9 May 2026</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Last updated</dt><dd class="m-article-footer__value">10 May 2026</dd></div></dl></section><section class="m-article-footer__group"><h3 class="m-article-footer__heading">Field notes</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Camera</dt><dd class="m-article-footer__value">Canon EOS R7</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Lens</dt><dd class="m-article-footer__value">Canon RF 100-500mm</dd></div></dl></section>`,
    );
  });

  it("omits empty equipment rows", () => {
    const result = renderJournalEntryFooter(
      createModule({
        equipment: {
          cameras: [],
          lenses: [],
        },
      }),
    );

    expect(result).not.toContain(`Camera</dt>`);
    expect(result).not.toContain(`Lens</dt>`);
  });

  it("joins multiple equipment values", () => {
    const result = renderJournalEntryFooter(
      createModule({
        equipment: {
          cameras: ["Canon EOS R7", "Canon EOS 7D Mark II"],
          lenses: ["Canon RF 100-500mm", "Canon RF 100mm Macro"],
        },
      }),
    );

    expect(result).toContain(
      `<dd class="m-article-footer__value">Canon EOS R7, Canon EOS 7D Mark II</dd>`,
    );
    expect(result).toContain(
      `<dd class="m-article-footer__value">Canon RF 100-500mm, Canon RF 100mm Macro</dd>`,
    );
  });

  it("escapes rendered values", () => {
    const result = renderJournalEntryFooter(
      createModule({
        publication: {
          author: `Kevin <bad>`,
          publishedAt: `9 <May>`,
          updatedAt: `10 "May" <bad>`,
        },
        equipment: {
          cameras: [`Canon <R7>`],
          lenses: [`RF "100-500" <bad>`],
        },
      }),
    );

    expect(result).toContain(`Kevin &lt;bad&gt;`);
    expect(result).toContain(`9 &lt;May&gt;`);
    expect(result).toContain(`10 &quot;May&quot; &lt;bad&gt;`);
    expect(result).toContain(`Canon &lt;R7&gt;`);
    expect(result).toContain(`RF &quot;100-500&quot; &lt;bad&gt;`);
  });
});
