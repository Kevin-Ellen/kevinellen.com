// src/rendering/body-content/inline/code/code.inline.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { CodeInlineTemplate } from "./code.inline.template";

describe("CodeInlineTemplate", () => {
  it("renders code inline content", () => {
    expect(
      renderToStaticMarkup(
        <CodeInlineTemplate
          item={{
            kind: "code",
            value: "npm run validate",
          }}
        />,
      ),
    ).toBe("<code>npm run validate</code>");
  });

  it("escapes html safely", () => {
    expect(
      renderToStaticMarkup(
        <CodeInlineTemplate
          item={{
            kind: "code",
            value: '<script>alert("x")</script>',
          }}
        />,
      ),
    ).toBe("<code>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</code>");
  });
});
