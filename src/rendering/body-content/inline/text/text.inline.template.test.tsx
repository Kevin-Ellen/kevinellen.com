// src/rendering/body-content/inline/text/text.inline.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextTextInline } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.types";

import { TextInlineTemplate } from "@rendering/body-content/inline/text/text.inline.template";

describe("TextInlineTemplate", () => {
  it("renders text inline content", () => {
    const item = {
      kind: "text",
      value: "Hello world",
    } as AppRenderContextTextInline;

    expect(renderToStaticMarkup(<TextInlineTemplate item={item} />)).toBe(
      "Hello world",
    );
  });

  it("escapes html safely", () => {
    const item = {
      kind: "text",
      value: '<script>alert("x")</script>',
    } as AppRenderContextTextInline;

    expect(renderToStaticMarkup(<TextInlineTemplate item={item} />)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });
});
