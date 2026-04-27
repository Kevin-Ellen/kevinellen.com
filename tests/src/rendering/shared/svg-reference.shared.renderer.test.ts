// tests/src/rendering/shared/svg-reference.shared.renderer.test.ts

import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";

describe("svg-reference.shared.renderer", () => {
  it("renders an escaped SVG reference", () => {
    const result = renderSvgReference(
      {
        id: "icon-github",
        width: 100,
        height: 100,
      },
      "c-icon",
    );

    expect(result)
      .toBe(`<svg class="c-icon" aria-hidden="true" width="100" height="100">
    <use href="#icon-github"></use>
  </svg>`);
  });
});
