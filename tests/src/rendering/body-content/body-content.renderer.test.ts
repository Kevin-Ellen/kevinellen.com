// tests/src/rendering/body-content/body-content.renderer.test.ts

import { renderBodyContent } from "@rendering/body-content/body-content.renderer";

describe("renderBodyContent", () => {
  it("renders body content header, content modules, and no footer when empty", () => {
    const result = renderBodyContent({
      header: {
        eyebrow: "Kevin Ellen",
        title: "About me",
        intro: "Nature and technology.",
      },
      content: [
        {
          kind: "articleSection",
          heading: {
            text: "A bit about me",
            level: 2,
            visuallyHidden: true,
          },
          modules: [
            {
              kind: "paragraph",
              flow: "content",
              content: [
                {
                  kind: "text",
                  value: "Hello.",
                },
              ],
            },
          ],
        },
      ],
      footer: [],
    });

    expect(result).toContain('<main class="l-main">');
    expect(result).toContain('<header class="m-heading l-content">');
    expect(result).toContain('<h1 class="m-heading__title">About me</h1>');
    expect(result).toContain('<section class="m-articleSection">');
    expect(result).toContain(
      '<p class="m-contentBlock m-contentBlock--paragraph l-content">Hello.</p>',
    );
    expect(result).not.toContain('class="m-pageFooter"');
  });
});
