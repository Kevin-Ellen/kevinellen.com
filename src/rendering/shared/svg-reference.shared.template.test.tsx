// src/rendering/shared/svg-reference.shared.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

import { SvgReferenceTemplate } from "@rendering/shared/svg-reference.shared.template";

describe("SvgReferenceTemplate", () => {
  it("renders an SVG reference", () => {
    const svg = {
      id: "icon-home",
      width: 24,
      height: 24,
    } as AppRenderContextSvgReference;

    expect(
      renderToStaticMarkup(
        <SvgReferenceTemplate svg={svg} className="c-button__icon" />,
      ),
    ).toBe(
      '<svg class="c-button__icon" aria-hidden="true" width="24" height="24"><use href="#icon-home"></use></svg>',
    );
  });

  it("renders different dimensions correctly", () => {
    const svg = {
      id: "icon-instagram",
      width: 32,
      height: 16,
    } as AppRenderContextSvgReference;

    expect(
      renderToStaticMarkup(
        <SvgReferenceTemplate svg={svg} className="c-social__icon" />,
      ),
    ).toBe(
      '<svg class="c-social__icon" aria-hidden="true" width="32" height="16"><use href="#icon-instagram"></use></svg>',
    );
  });
});
