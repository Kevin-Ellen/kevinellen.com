// src/rendering/body-content/footer/journal-entry-footer/journal-entry-footer.footer.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.types";

import { JournalEntryFooterTemplate } from "@rendering/body-content/footer/journal-entry-footer/journal-entry-footer.footer.template";

const footer = (
  overrides: Partial<AppRenderContextJournalEntryFooter> = {},
): AppRenderContextJournalEntryFooter =>
  ({
    publication: {
      author: "Kevin Ellen",
      publishedAt: "16 May 2026",
      updatedAt: "17 May 2026",
    },

    equipment: {
      cameras: ["Canon EOS R7"],
      lenses: ["RF 100-500mm F4.5-7.1L IS USM"],
    },

    ...overrides,
  }) as AppRenderContextJournalEntryFooter;

describe("JournalEntryFooterTemplate", () => {
  it("renders the journal entry footer", () => {
    expect(
      renderToStaticMarkup(<JournalEntryFooterTemplate footer={footer()} />),
    ).toBe(
      '<section class="m-article-footer__group"><h3 class="m-article-footer__heading">Publication</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Written by</dt><dd class="m-article-footer__value">Kevin Ellen</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Published</dt><dd class="m-article-footer__value">16 May 2026</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Last updated</dt><dd class="m-article-footer__value">17 May 2026</dd></div></dl></section><section class="m-article-footer__group"><h3 class="m-article-footer__heading">Field notes</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Camera</dt><dd class="m-article-footer__value">Canon EOS R7</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Lens</dt><dd class="m-article-footer__value">RF 100-500mm F4.5-7.1L IS USM</dd></div></dl></section>',
    );
  });

  it("omits empty equipment groups", () => {
    const html = renderToStaticMarkup(
      <JournalEntryFooterTemplate
        footer={footer({
          equipment: {
            cameras: [],
            lenses: [],
          },
        })}
      />,
    );

    expect(html).not.toContain(">Camera<");
    expect(html).not.toContain(">Lens<");
  });

  it("escapes unsafe content", () => {
    const html = renderToStaticMarkup(
      <JournalEntryFooterTemplate
        footer={footer({
          publication: {
            author: '<script>alert("x")</script>',
            publishedAt: "Today",
            updatedAt: "Tomorrow",
          },
        })}
      />,
    );

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});
