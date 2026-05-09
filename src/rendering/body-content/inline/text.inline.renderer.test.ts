// src/rendering/body-content/inline/text.inline.renderer.test.ts

import type { AppRenderContextTextInline } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.types";

import { renderTextInline } from "@rendering/body-content/inline/text.inline.renderer";

describe("renderTextInline", () => {
  it("renders plain text", () => {
    const item = {
      kind: "text",
      value: "Hello world",
    } as AppRenderContextTextInline;

    expect(renderTextInline(item)).toBe("Hello world");
  });

  it("escapes HTML characters", () => {
    const item = {
      kind: "text",
      value: `<script>alert("xss")</script>`,
    } as AppRenderContextTextInline;

    expect(renderTextInline(item)).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
    );
  });

  it("renders empty text", () => {
    const item = {
      kind: "text",
      value: "",
    } as AppRenderContextTextInline;

    expect(renderTextInline(item)).toBe("");
  });
});
