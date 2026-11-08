// src/app/life-cycle/app-resolve/resolvers/registry/svg/svg.registry.resolver.app-resolve.test.ts

import { resolveSvgRegistryAppResolve } from "./svg.registry.resolver.app-resolve";

type AppInit = Parameters<typeof resolveSvgRegistryAppResolve>[0]["appInit"];

type Svg = AppInit["assets"]["svg"];

describe("SVG registry AppResolve resolver", () => {
  const createAppInit = (svg: Svg): AppInit =>
    ({
      assets: {
        svg,
      },
    }) as unknown as AppInit;

  it("returns the SVG registry from AppInit", () => {
    const svg = {
      registry: {},
    } as unknown as Svg;

    const result = resolveSvgRegistryAppResolve({
      appInit: createAppInit(svg),
    });

    expect(result).toBe(svg);
  });

  it("preserves the original registry without cloning", () => {
    const svg = Object.freeze({
      registry: Object.freeze({}),
    }) as unknown as Svg;

    const appInit = createAppInit(svg);

    const first = resolveSvgRegistryAppResolve({ appInit });
    const second = resolveSvgRegistryAppResolve({ appInit });

    expect(first).toBe(svg);
    expect(second).toBe(svg);
  });
});
