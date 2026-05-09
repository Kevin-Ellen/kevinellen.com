// src/app-render-context/shared/svg-reference-by-id.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";
import { resolveSvgReferencesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";

jest.mock("@app-render-context/shared/svg.resolve.app-render-context", () => ({
  resolveSvgReferencesAppRenderContext: jest.fn(),
}));

describe("resolveSvgReferenceByIdAppRenderContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when svg id is null", () => {
    expect(
      resolveSvgReferenceByIdAppRenderContext({} as AppContext, null),
    ).toBeNull();
  });

  it("returns matching SVG reference", () => {
    jest.mocked(resolveSvgReferencesAppRenderContext).mockReturnValue([
      {
        id: "icon-home",
        width: 1,
        height: 1,
      },
    ] as never);

    expect(
      resolveSvgReferenceByIdAppRenderContext({} as AppContext, "icon-home"),
    ).toEqual({
      id: "icon-home",
      width: 1,
      height: 1,
    });
  });

  it("throws when SVG asset is missing", () => {
    jest.mocked(resolveSvgReferencesAppRenderContext).mockReturnValue([]);

    expect(() =>
      resolveSvgReferenceByIdAppRenderContext(
        {} as AppContext,
        "missing-svg" as never,
      ),
    ).toThrow("Missing SVG asset: missing-svg");
  });
});
