// src/rendering/shared/svg-reference.shared.renderer.test.ts

import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

import { renderSvgReference } from "@rendering/shared/svg-reference.shared.renderer";

const createSvg = (
  overrides: Partial<AppRenderContextSvgReference> = {},
): AppRenderContextSvgReference =>
  ({
    id: "icon-camera",
    width: 24,
    height: 24,
    ...overrides,
  }) as AppRenderContextSvgReference;

describe("renderSvgReference", () => {
  it("renders svg reference", () => {
    expect(renderSvgReference(createSvg(), "m-icon")).toBe(
      `<svg class="m-icon" aria-hidden="true" width="24" height="24"><use href="#icon-camera"></use></svg>`,
    );
  });

  it("escapes class name", () => {
    expect(renderSvgReference(createSvg(), `icon-"bad"`)).toBe(
      `<svg class="icon-&quot;bad&quot;" aria-hidden="true" width="24" height="24"><use href="#icon-camera"></use></svg>`,
    );
  });

  it("renders different dimensions", () => {
    expect(
      renderSvgReference(
        createSvg({
          width: 120,
          height: 48,
        }),
        "m-logo",
      ),
    ).toBe(
      `<svg class="m-logo" aria-hidden="true" width="120" height="48"><use href="#icon-camera"></use></svg>`,
    );
  });
});
