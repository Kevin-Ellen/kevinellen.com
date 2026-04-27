// tests/src/rendering/body-content/block/article-section.body-content.renderer.test.ts

import { renderArticleSectionBlockContentModule } from "@rendering/body-content/block/article-section.body-content.renderer";

describe("renderArticleSectionBlockContentModule", () => {
  it("renders an article section with heading and child modules", () => {
    const result = renderArticleSectionBlockContentModule({
      kind: "articleSection",
      heading: {
        text: "Nature",
        level: 2,
        visuallyHidden: false,
      },
      modules: [
        {
          kind: "paragraph",
          flow: "content",
          content: [
            {
              kind: "text",
              value: "Forest text.",
            },
          ],
        },
      ],
    });

    expect(result).toBe(`<section class="m-articleSection">
    <h2 class="l-content">Nature</h2>
    <p class="m-contentBlock m-contentBlock--paragraph l-content">Forest text.</p>
  </section>`);
  });

  it("renders a visually hidden heading", () => {
    const result = renderArticleSectionBlockContentModule({
      kind: "articleSection",
      heading: {
        text: "Hidden",
        level: 2,
        visuallyHidden: true,
      },
      modules: [],
    });

    expect(result).toContain('<h2 class="u-sr-only l-content">Hidden</h2>');
    expect(result).toContain('<section class="m-articleSection">');
    expect(result).toContain("</section>");
  });
});
