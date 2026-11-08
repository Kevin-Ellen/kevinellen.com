// src/app/life-cycle/app-resolve/resolvers/registry/scripts/scripts.registry.resolver.app-resolve.test.ts

import { resolveScriptsRegistryAppResolve } from "./scripts.registry.resolver.app-resolve";

type AppInit = Parameters<
  typeof resolveScriptsRegistryAppResolve
>[0]["appInit"];

type Scripts = AppInit["assets"]["scripts"];

describe("Scripts registry AppResolve resolver", () => {
  const createAppInit = (scripts: Scripts): AppInit =>
    ({
      assets: {
        scripts,
      },
    }) as unknown as AppInit;

  it("returns the scripts registry from AppInit", () => {
    const scripts = {
      registry: {},
    } as unknown as Scripts;

    const result = resolveScriptsRegistryAppResolve({
      appInit: createAppInit(scripts),
    });

    expect(result).toBe(scripts);
  });

  it("preserves the original registry without cloning", () => {
    const scripts = Object.freeze({
      registry: Object.freeze({}),
    }) as unknown as Scripts;

    const appInit = createAppInit(scripts);

    const first = resolveScriptsRegistryAppResolve({ appInit });
    const second = resolveScriptsRegistryAppResolve({ appInit });

    expect(first).toBe(scripts);
    expect(second).toBe(scripts);
  });
});
