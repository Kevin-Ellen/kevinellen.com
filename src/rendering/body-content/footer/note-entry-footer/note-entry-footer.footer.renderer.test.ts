// src/rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.renderer.test.ts

import type { AppRenderContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-render-context.note-entry-footer.types";

import { renderNoteEntryFooter } from "@rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.renderer";

const createModule = (
  overrides: Partial<AppRenderContextNoteEntryFooter> = {},
): AppRenderContextNoteEntryFooter =>
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
  }) as AppRenderContextNoteEntryFooter;

describe("renderNoteEntryFooter", () => {
  it("renders publication and note detail footer groups", () => {
    expect(renderNoteEntryFooter(createModule())).toBe(
      `<section class="m-article-footer__group"><h3 class="m-article-footer__heading">Publication</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Written by</dt><dd class="m-article-footer__value">Kevin Ellen</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Published</dt><dd class="m-article-footer__value">10 May 2026</dd></div><div class="m-article-footer__item"><dt class="m-article-footer__label">Last updated</dt><dd class="m-article-footer__value">11 May 2026</dd></div></dl></section><section class="m-article-footer__group"><h3 class="m-article-footer__heading">Note details</h3><dl class="m-article-footer__list"><div class="m-article-footer__item"><dt class="m-article-footer__label">Topic</dt><dd class="m-article-footer__value">Architecture</dd></div></dl></section>`,
    );
  });

  it("escapes rendered values", () => {
    const result = renderNoteEntryFooter(
      createModule({
        publication: {
          author: `Kevin <bad>`,
          publishedAt: `10 <May>`,
          updatedAt: `11 "May" <bad>`,
        },
        topic: `TypeScript <Architecture>`,
      }),
    );

    expect(result).toContain(`Kevin &lt;bad&gt;`);
    expect(result).toContain(`10 &lt;May&gt;`);
    expect(result).toContain(`11 &quot;May&quot; &lt;bad&gt;`);
    expect(result).toContain(`TypeScript &lt;Architecture&gt;`);
  });
});
