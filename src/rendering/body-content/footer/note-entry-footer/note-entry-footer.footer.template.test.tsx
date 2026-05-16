// src/rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-render-context.note-entry-footer.types";

import { NoteEntryFooterTemplate } from "@rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.template";

const footer = (
  overrides: Partial<AppRenderContextNoteEntryFooter> = {},
): AppRenderContextNoteEntryFooter =>
  ({
    publication: {
      author: "Kevin Ellen",
      publishedAt: "16 May 2026",
      updatedAt: "17 May 2026",
    },
    topic: "Rendering",
    ...overrides,
  }) as AppRenderContextNoteEntryFooter;

describe("NoteEntryFooterTemplate", () => {
  it("renders the note entry footer", () => {
    expect(
      renderToStaticMarkup(<NoteEntryFooterTemplate footer={footer()} />),
    ).toBe(
      '<section class="m-article-footer__group"><h3 class="m-article-footer__heading">Publication</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Written by</dt><dd class="m-article-footer__value">Kevin Ellen</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Published</dt><dd class="m-article-footer__value">16 May 2026</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Last updated</dt><dd class="m-article-footer__value">17 May 2026</dd></div></dl></section><section class="m-article-footer__group"><h3 class="m-article-footer__heading">Note details</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Topic</dt><dd class="m-article-footer__value">Rendering</dd></div></dl></section>',
    );
  });

  it("escapes unsafe content", () => {
    const html = renderToStaticMarkup(
      <NoteEntryFooterTemplate
        footer={footer({
          topic: '<script>alert("x")</script>',
        })}
      />,
    );

    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});
