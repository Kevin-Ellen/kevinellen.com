// tests/src/rendering/body-content/block/paragraph.body-content.renderer.test.ts

import { renderParagraphBlockContentModule } from "@rendering/body-content/block/paragraph.body-content.renderer";

describe("renderParagraphBlockContentModule", () => {
  it("renders a paragraph block with flow class and inline content", () => {
    const result = renderParagraphBlockContentModule({
      kind: "paragraph",
      flow: "content",
      content: [
        {
          kind: "text",
          value: "Hello <duck>",
        },
      ],
    });

    expect(result).toBe(
      '<p class="m-contentBlock m-contentBlock--paragraph l-content">Hello &lt;duck&gt;</p>',
    );
  });
});
