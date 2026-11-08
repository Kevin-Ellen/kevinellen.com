// src/shared/resolvers/assets/asset.resolver.shared.app-init.test.ts

import { svgAssetsConfigAuthored } from "../../config/assets/svg.assets.config.shared.app-init";
import { scriptsAssetsConfigAuthored } from "../../config/assets/scripts.assets.config.shared.app-init";

import { resolveSvgAssetsConfigAppInit } from "./svg/svg.asset.app-init";
import { resolveScriptsAssetConfigAppInit } from "./scripts/scripts.asset.resolver.app-init";

import { resolveAssetConfigAppInit } from "./asset.resolver.shared.app-init";

jest.mock("./svg/svg.asset.app-init", () => ({
  resolveSvgAssetsConfigAppInit: jest.fn(),
}));

jest.mock("./scripts/scripts.asset.resolver.app-init", () => ({
  resolveScriptsAssetConfigAppInit: jest.fn(),
}));

const mockedSvgResolver = jest.mocked(resolveSvgAssetsConfigAppInit);

const mockedScriptsResolver = jest.mocked(resolveScriptsAssetConfigAppInit);

describe("Asset AppInit configuration resolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("passes the authored SVG configuration to its resolver", () => {
    resolveAssetConfigAppInit();

    expect(mockedSvgResolver).toHaveBeenCalledWith({
      authored: svgAssetsConfigAuthored,
    });

    expect(mockedSvgResolver).toHaveBeenCalledTimes(1);
  });

  it("passes the authored scripts configuration to its resolver", () => {
    resolveAssetConfigAppInit();

    expect(mockedScriptsResolver).toHaveBeenCalledWith({
      authored: scriptsAssetsConfigAuthored,
    });

    expect(mockedScriptsResolver).toHaveBeenCalledTimes(1);
  });

  it("returns the resolved SVG and scripts configurations", () => {
    const svg = {
      logo: {
        id: "logo",
        markup: "<svg></svg>",
      },
    } as unknown as ReturnType<typeof resolveSvgAssetsConfigAppInit>;

    const scripts = {
      registry: {
        analytics: {
          id: "analytics",
        },
      },
    } as unknown as ReturnType<typeof resolveScriptsAssetConfigAppInit>;

    mockedSvgResolver.mockReturnValue(svg);
    mockedScriptsResolver.mockReturnValue(scripts);

    expect(resolveAssetConfigAppInit()).toEqual({
      svg,
      scripts,
    });
  });

  it("preserves the references returned by both resolvers", () => {
    const svg = {} as ReturnType<typeof resolveSvgAssetsConfigAppInit>;

    const scripts = {} as ReturnType<typeof resolveScriptsAssetConfigAppInit>;

    mockedSvgResolver.mockReturnValue(svg);
    mockedScriptsResolver.mockReturnValue(scripts);

    const result = resolveAssetConfigAppInit();

    expect(result.svg).toBe(svg);
    expect(result.scripts).toBe(scripts);
  });

  it("calls the SVG resolver before the scripts resolver", () => {
    resolveAssetConfigAppInit();

    expect(mockedSvgResolver.mock.invocationCallOrder[0]).toBeLessThan(
      mockedScriptsResolver.mock.invocationCallOrder[0],
    );
  });

  it("propagates SVG resolution failures", () => {
    const error = new Error("SVG resolution failed");

    mockedSvgResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolveAssetConfigAppInit()).toThrow(error);

    expect(mockedScriptsResolver).not.toHaveBeenCalled();
  });

  it("propagates scripts resolution failures", () => {
    const error = new Error("Scripts resolution failed");

    mockedScriptsResolver.mockImplementation(() => {
      throw error;
    });

    expect(() => resolveAssetConfigAppInit()).toThrow(error);

    expect(mockedSvgResolver).toHaveBeenCalledTimes(1);
  });
});
