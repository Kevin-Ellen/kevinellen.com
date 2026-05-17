// src/rendering/shared/code.shared.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { CodeTemplate } from "@rendering/shared/code.shared.template";

describe("CodeTemplate", () => {
  it("renders code content", () => {
    expect(
      renderToStaticMarkup(<CodeTemplate value="const answer = 42;" />),
    ).toBe("<code>const answer = 42;</code>");
  });

  it("renders language class when language is provided", () => {
    expect(
      renderToStaticMarkup(
        <CodeTemplate value="const answer = 42;" language="ts" />,
      ),
    ).toBe('<code class="language-ts">const answer = 42;</code>');
  });

  it("does not render class attribute when language is null", () => {
    expect(
      renderToStaticMarkup(
        <CodeTemplate value="const answer = 42;" language={null} />,
      ),
    ).toBe("<code>const answer = 42;</code>");
  });
});
