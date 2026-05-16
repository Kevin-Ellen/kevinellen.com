// src/rendering/body-content/block/article-section/article-section.block.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextArticleSectionBlock } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.types";

import { ArticleSectionBlockTemplate } from "@rendering/body-content/block/article-section/article-section.block.template";

const block = (
  overrides: Partial<AppRenderContextArticleSectionBlock> = {},
): AppRenderContextArticleSectionBlock =>
  ({
    kind: "articleSection",
    heading: {
      text: "Field notes",
      level: 2,
      visuallyHidden: false,
    },
    modules: [
      {
        kind: "paragraph",
        flow: "content",
        content: [{ kind: "text", value: "A quiet morning by the reeds." }],
      },
    ],
    ...overrides,
  }) as AppRenderContextArticleSectionBlock;

describe("ArticleSectionBlockTemplate", () => {
  it("renders an article section", () => {
    expect(
      renderToStaticMarkup(<ArticleSectionBlockTemplate block={block()} />),
    ).toBe(
      '<section class="m-articleSection"><h2 class="l-content">Field notes</h2><p class="m-contentBlock m-contentBlock--paragraph l-content">A quiet morning by the reeds.</p></section>',
    );
  });

  it("renders an empty article section", () => {
    expect(
      renderToStaticMarkup(
        <ArticleSectionBlockTemplate block={block({ modules: [] })} />,
      ),
    ).toBe(
      '<section class="m-articleSection"><h2 class="l-content">Field notes</h2></section>',
    );
  });
});
