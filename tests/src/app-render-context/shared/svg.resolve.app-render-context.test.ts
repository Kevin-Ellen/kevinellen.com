// tests/src/app-render-context/shared/svg.resolve.app-render-context.test.ts

import {
  resolveSvgReferencesAppRenderContext,
  resolveSvgSpritesAppRenderContext,
} from "@app-render-context/shared/svg.resolve.app-render-context";
import { resolveSvgReferenceDimensions } from "@utils/normaliseDimensions.util";

import type { AppContext } from "@app-context/class.app-context";

jest.mock("@utils/normaliseDimensions.util", () => ({
  resolveSvgReferenceDimensions: jest.fn(),
}));

describe("svg render context resolvers", () => {
  const appContext = {
    assets: {
      svg: [
        {
          id: "icon-home",
          viewBox: "0 0 200 100",
          content: "<path />",
        },
        {
          id: "logo-monogram-ke",
          viewBox: "0 0 100 100",
          content: "<circle />",
        },
      ],
    },
  } as unknown as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(resolveSvgReferenceDimensions)
      .mockImplementation((viewBox: string) => {
        if (viewBox === "0 0 200 100") {
          return {
            width: 100,
            height: 50,
          };
        }

        return {
          width: 100,
          height: 100,
        };
      });
  });

  it("resolves SVG references with normalised dimensions", () => {
    const result = resolveSvgReferencesAppRenderContext(appContext);

    expect(resolveSvgReferenceDimensions).toHaveBeenCalledTimes(2);
    expect(resolveSvgReferenceDimensions).toHaveBeenNthCalledWith(
      1,
      "0 0 200 100",
    );
    expect(resolveSvgReferenceDimensions).toHaveBeenNthCalledWith(
      2,
      "0 0 100 100",
    );

    expect(result).toEqual([
      {
        id: "icon-home",
        width: 100,
        height: 50,
      },
      {
        id: "logo-monogram-ke",
        width: 100,
        height: 100,
      },
    ]);
  });

  it("resolves SVG sprites without render reference dimensions", () => {
    const result = resolveSvgSpritesAppRenderContext(appContext);

    expect(resolveSvgReferenceDimensions).not.toHaveBeenCalled();

    expect(result).toEqual([
      {
        id: "icon-home",
        viewBox: "0 0 200 100",
        content: "<path />",
      },
      {
        id: "logo-monogram-ke",
        viewBox: "0 0 100 100",
        content: "<circle />",
      },
    ]);
  });
});
