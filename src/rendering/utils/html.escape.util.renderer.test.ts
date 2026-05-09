// src/rendering/utils/html.escape.util.renderer.test.ts

import {
  escapeAttribute,
  escapeHtml,
  escapeJsonScriptContent,
} from "@rendering/utils/html.escape.util.renderer";

describe("escapeHtml", () => {
  it("escapes HTML-sensitive characters", () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      `&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;`,
    );
  });

  it("returns unchanged safe text", () => {
    expect(escapeHtml("Coot in soft light")).toBe("Coot in soft light");
  });

  it("escapes multiple occurrences", () => {
    expect(escapeHtml(`<<&&>>""''`)).toBe(
      `&lt;&lt;&amp;&amp;&gt;&gt;&quot;&quot;&#39;&#39;`,
    );
  });

  it("returns empty string unchanged", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("escapeAttribute", () => {
  it("escapes attribute values", () => {
    expect(escapeAttribute(`"bad" onclick="alert('x')"`)).toBe(
      `&quot;bad&quot; onclick=&quot;alert(&#39;x&#39;)&quot;`,
    );
  });

  it("delegates to escapeHtml", () => {
    expect(escapeAttribute(`<bad & dangerous>`)).toBe(
      `&lt;bad &amp; dangerous&gt;`,
    );
  });

  it("returns empty string unchanged", () => {
    expect(escapeAttribute("")).toBe("");
  });
});

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
