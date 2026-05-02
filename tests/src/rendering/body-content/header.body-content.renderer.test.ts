// tests/src/rendering/body-content/header.body-content.renderer.test.ts

import { renderBodyContentHeader } from "@rendering/body-content/header.body-content.renderer";

describe("renderBodyContentHeader", () => {
  it("renders the required heading title", () => {
    const html = renderBodyContentHeader({
      eyebrow: null,
      title: "About",
      intro: null,
    });

    expect(html).toContain(`<header class="m-heading l-content">`);
    expect(html).toContain(`<h1 class="m-heading__title">About</h1>`);
  });

  it("renders eyebrow when provided", () => {
    const html = renderBodyContentHeader({
      eyebrow: "Journal",
      title: "Unexpected encounters",
      intro: null,
    });

    expect(html).toContain(`<p class="m-heading__eyebrow">Journal</p>`);
  });

  it("renders intro when provided", () => {
    const html = renderBodyContentHeader({
      eyebrow: null,
      title: "Unexpected encounters",
      intro: "A field note from Mallorca.",
    });

    expect(html).toContain(
      `<p class="m-heading__intro">A field note from Mallorca.</p>`,
    );
  });

  it("omits eyebrow and intro when not provided", () => {
    const html = renderBodyContentHeader({
      eyebrow: null,
      title: "About",
      intro: null,
    });

    expect(html).not.toContain(`m-heading__eyebrow`);
    expect(html).not.toContain(`m-heading__intro`);
  });

  it("escapes rendered text content", () => {
    const html = renderBodyContentHeader({
      eyebrow: `Birds & <notes>`,
      title: `Kevin "Duck" <Ellen>`,
      intro: `Field notes & technical <architecture>.`,
    });

    expect(html).toContain(`Birds &amp; &lt;notes&gt;`);
    expect(html).toContain(`Kevin &quot;Duck&quot; &lt;Ellen&gt;`);
    expect(html).toContain(`Field notes &amp; technical &lt;architecture&gt;.`);
  });
});
