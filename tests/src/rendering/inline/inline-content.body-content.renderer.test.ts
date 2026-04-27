// tests/src/rendering/body-content/inline/inline-content.body-content.renderer.test.ts

import { renderInlineContent } from "@rendering/body-content/inline/inline-content.body-content.renderer";

describe("renderInlineContent", () => {
  it("renders mixed inline content", () => {
    const result = renderInlineContent([
      {
        kind: "text",
        value: "Hello ",
      },
      {
        kind: "strong",
        content: [
          {
            kind: "text",
            value: "duck",
          },
        ],
      },
      {
        kind: "text",
        value: " and ",
      },
      {
        kind: "emphasis",
        content: [
          {
            kind: "text",
            value: "forest",
          },
        ],
      },
      {
        kind: "lineBreak",
      },
      {
        kind: "code",
        value: "const x = 1;",
      },
      {
        kind: "link",
        link: {
          kind: "internal",
          href: "/about",
          text: "About",
          openInNewTab: false,
          svg: null,
        },
      },
    ]);

    expect(result).toBe(
      'Hello <strong>duck</strong> and <em>forest</em><br><code>const x = 1;</code><a href="/about">About</a>',
    );
  });
});
