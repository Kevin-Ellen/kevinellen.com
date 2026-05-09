// src/rendering/body-content/header.body-content.renderer.test.ts

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { renderBodyContentHeader } from "@rendering/body-content/header.body-content.renderer";

type Header = AppRenderContextBodyContent["header"];

const createHeader = (
  overrides: Partial<NonNullable<Header>> = {},
): NonNullable<Header> =>
  ({
    title: "Journal",
    eyebrow: "Field notes",
    intro: "Recent sightings and observations.",
    showInBody: true,
    ...overrides,
  }) as NonNullable<Header>;

describe("renderBodyContentHeader", () => {
  it("renders body content header", () => {
    expect(renderBodyContentHeader(createHeader())).toBe(
      `<header class="m-heading l-content"><p class="m-heading__eyebrow">Field notes</p><h1 class="m-heading__title">Journal</h1><p class="m-heading__intro">Recent sightings and observations.</p></header>`,
    );
  });

  it("returns empty string when header is null", () => {
    expect(renderBodyContentHeader(null)).toBe("");
  });

  it("returns empty string when showInBody is false", () => {
    expect(
      renderBodyContentHeader(
        createHeader({
          showInBody: false,
        }),
      ),
    ).toBe("");
  });

  it("omits eyebrow when not present", () => {
    const result = renderBodyContentHeader(
      createHeader({
        eyebrow: null,
      }),
    );

    expect(result).not.toContain("m-heading__eyebrow");
  });

  it("omits intro when not present", () => {
    const result = renderBodyContentHeader(
      createHeader({
        intro: null,
      }),
    );

    expect(result).not.toContain("m-heading__intro");
  });

  it("escapes rendered values", () => {
    const result = renderBodyContentHeader(
      createHeader({
        title: `Journal <script>alert("x")</script>`,
        eyebrow: `Field <notes>`,
        intro: `Intro "text" <bad>`,
      }),
    );

    expect(result).toContain(
      `Journal &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;`,
    );

    expect(result).toContain(`Field &lt;notes&gt;`);

    expect(result).toContain(`Intro &quot;text&quot; &lt;bad&gt;`);
  });
});
