// tests/src/app-render-context/shared/svg-reference-by-id.resolve.app-render-context.test.ts

import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";
import { resolveSvgReferencesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock("@app-render-context/shared/svg.resolve.app-render-context", () => ({
  resolveSvgReferencesAppRenderContext: jest.fn(),
}));

describe("resolveSvgReferenceByIdAppRenderContext", () => {
  const appContext = {} as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when svgId is null", () => {
    const result = resolveSvgReferenceByIdAppRenderContext(appContext, null);

    expect(result).toBeNull();
    expect(resolveSvgReferencesAppRenderContext).not.toHaveBeenCalled();
  });

  it("returns the matching SVG reference", () => {
    const svg = {
      id: "icon-home",
      width: 100,
      height: 100,
    } as const;

    jest.mocked(resolveSvgReferencesAppRenderContext).mockReturnValue([
      svg,
      {
        id: "logo-monogram-ke",
        width: 100,
        height: 100,
      },
    ]);

    const result = resolveSvgReferenceByIdAppRenderContext(
      appContext,
      "icon-home",
    );

    expect(resolveSvgReferencesAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );
    expect(result).toBe(svg);
  });

  it("throws when the SVG asset cannot be found", () => {
    jest.mocked(resolveSvgReferencesAppRenderContext).mockReturnValue([]);

    expect(() =>
      resolveSvgReferenceByIdAppRenderContext(appContext, "icon-home"),
    ).toThrow("Missing SVG asset: icon-home");
  });
});
