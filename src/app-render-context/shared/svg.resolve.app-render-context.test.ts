// src/app-render-context/shared/svg.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import {
  resolveSvgReferencesAppRenderContext,
  resolveSvgSpritesAppRenderContext,
} from "@app-render-context/shared/svg.resolve.app-render-context";

import { resolveSvgReferenceDimensions } from "@utils/normaliseDimensions.util";

jest.mock("@utils/normaliseDimensions.util", () => ({
  resolveSvgReferenceDimensions: jest.fn(),
}));

describe("resolveSvgReferencesAppRenderContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves SVG references", () => {
    jest.mocked(resolveSvgReferenceDimensions).mockReturnValue({
      width: 24,
      height: 24,
    });

    const appContext = {
      assets: {
        svg: [
          {
            id: "duck",
            viewBox: "0 0 24 24",
          },
        ],
      },
    } as unknown as AppContext;

    expect(resolveSvgReferencesAppRenderContext(appContext)).toEqual([
      {
        id: "duck",
        width: 24,
        height: 24,
      },
    ]);

    expect(resolveSvgReferenceDimensions).toHaveBeenCalledWith("0 0 24 24");
  });
});

describe("resolveSvgSpritesAppRenderContext", () => {
  it("resolves SVG sprite assets", () => {
    const appContext = {
      assets: {
        svg: [
          {
            id: "duck",
            viewBox: "0 0 24 24",
            content: "<path />",
          },
        ],
      },
    } as unknown as AppContext;

    expect(resolveSvgSpritesAppRenderContext(appContext)).toEqual([
      {
        id: "duck",
        viewBox: "0 0 24 24",
        content: "<path />",
      },
    ]);
  });
});
