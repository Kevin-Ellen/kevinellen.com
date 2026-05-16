// src/rendering/utils/html.escape.util.renderer.test.ts

import { escapeJsonScriptContent } from "@rendering/utils/html.escape.util.renderer";

describe("escapeJsonScriptContent", () => {
  it("escapes JSON script-sensitive characters", () => {
    expect(
      escapeJsonScriptContent(`<script>{"key":"Tom & Jerry"}</script>`),
    ).toBe(
      `\\u003Cscript\\u003E{"key":"Tom \\u0026 Jerry"}\\u003C/script\\u003E`,
    );
  });

  it("escapes unicode line separators", () => {
    expect(escapeJsonScriptContent(`before\u2028middle\u2029after`)).toBe(
      `before\\u2028middle\\u2029after`,
    );
  });

  it("returns unchanged safe JSON content", () => {
    expect(escapeJsonScriptContent(`{"title":"Coot"}`)).toBe(
      `{"title":"Coot"}`,
    );
  });

  it("returns empty string unchanged", () => {
    expect(escapeJsonScriptContent("")).toBe("");
  });
});
