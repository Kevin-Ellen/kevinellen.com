// src/rendering/body-content/inline/code.inline.renderer.test.ts

import type { AppRenderContextCodeInline } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.types";

import { renderCodeInline } from "@rendering/body-content/inline/code.inline.renderer";

describe("renderCodeInlineContent", () => {
  it("renders inline code", () => {
    const item = {
      kind: "code",
      value: "const answer = 42;",
    } as AppRenderContextCodeInline;

    expect(renderCodeInline(item)).toBe(`<code>const answer = 42;</code>`);
  });

  it("escapes HTML characters inside inline code", () => {
    const item = {
      kind: "code",
      value: `<script>alert("xss")</script>`,
    } as AppRenderContextCodeInline;

    expect(renderCodeInline(item)).toBe(
      `<code>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</code>`,
    );
  });

  it("renders empty inline code content", () => {
    const item = {
      kind: "code",
      value: "",
    } as AppRenderContextCodeInline;

    expect(renderCodeInline(item)).toBe(`<code></code>`);
  });
});
