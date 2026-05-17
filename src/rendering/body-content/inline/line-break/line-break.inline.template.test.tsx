// src/rendering/body-content/inline/line-break/line-break.inline.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { LineBreakInlineTemplate } from "@rendering/body-content/inline/line-break/line-break.inline.template";

describe("LineBreakInlineTemplate", () => {
  it("renders a line break", () => {
    expect(
      renderToStaticMarkup(
        <LineBreakInlineTemplate
          item={{
            kind: "lineBreak",
          }}
        />,
      ),
    ).toBe("<br/>");
  });
});
