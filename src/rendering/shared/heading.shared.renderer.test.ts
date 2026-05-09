// src/rendering/shared/heading.shared.renderer.test.ts

import {
  renderHeading,
  type RenderableHeading,
} from "@rendering/shared/heading.shared.renderer";

const createHeading = (
  overrides: Partial<RenderableHeading> = {},
): RenderableHeading => ({
  level: 2,
  text: "Latest field notes",
  ...overrides,
});

describe("renderHeading", () => {
  it("renders heading", () => {
    expect(renderHeading(createHeading())).toBe(`<h2>Latest field notes</h2>`);
  });

  it("renders heading with class name", () => {
    expect(
      renderHeading(createHeading(), {
        className: "m-heading__title",
      }),
    ).toBe(`<h2 class="m-heading__title">Latest field notes</h2>`);
  });

  it("renders visually hidden heading", () => {
    expect(
      renderHeading(
        createHeading({
          visuallyHidden: true,
        }),
      ),
    ).toBe(`<h2 class="u-sr-only">Latest field notes</h2>`);
  });

  it("renders heading with class name and visually hidden class", () => {
    expect(
      renderHeading(
        createHeading({
          visuallyHidden: true,
        }),
        {
          className: "m-heading__title",
        },
      ),
    ).toBe(`<h2 class="m-heading__title u-sr-only">Latest field notes</h2>`);
  });

  it("renders different heading levels", () => {
    expect(
      renderHeading(
        createHeading({
          level: 6,
        }),
      ),
    ).toBe(`<h6>Latest field notes</h6>`);
  });

  it("escapes heading text and class name", () => {
    expect(
      renderHeading(
        createHeading({
          text: `Heading <script>alert("x")</script>`,
          visuallyHidden: true,
        }),
        {
          className: `heading-"bad"`,
        },
      ),
    ).toBe(
      `<h2 class="heading-&quot;bad&quot; u-sr-only">Heading &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</h2>`,
    );
  });
});
