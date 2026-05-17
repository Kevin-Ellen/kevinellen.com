// src/rendering/shared/heading.shared.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { HeadingTemplate } from "@rendering/shared/heading.shared.template";

describe("HeadingTemplate", () => {
  it("renders a heading with the correct level", () => {
    expect(
      renderToStaticMarkup(
        <HeadingTemplate
          heading={{
            text: "Section heading",
            level: 2,
          }}
        />,
      ),
    ).toBe("<h2>Section heading</h2>");
  });

  it("renders a heading with a class name", () => {
    expect(
      renderToStaticMarkup(
        <HeadingTemplate
          heading={{
            text: "Styled heading",
            level: 3,
          }}
          className="m-heading"
        />,
      ),
    ).toBe('<h3 class="m-heading">Styled heading</h3>');
  });

  it("renders a visually hidden heading", () => {
    expect(
      renderToStaticMarkup(
        <HeadingTemplate
          heading={{
            text: "Hidden heading",
            level: 4,
            visuallyHidden: true,
          }}
        />,
      ),
    ).toBe('<h4 class="u-sr-only">Hidden heading</h4>');
  });

  it("renders combined class names", () => {
    expect(
      renderToStaticMarkup(
        <HeadingTemplate
          heading={{
            text: "Combined classes",
            level: 5,
            visuallyHidden: true,
          }}
          className="m-heading"
        />,
      ),
    ).toBe('<h5 class="m-heading u-sr-only">Combined classes</h5>');
  });
});
