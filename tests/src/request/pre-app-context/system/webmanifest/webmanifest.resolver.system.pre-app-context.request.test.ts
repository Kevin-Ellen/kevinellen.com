// tests/src/request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request.test.ts

import { resolveWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

describe("resolveWebmanifestSystem", () => {
  it("returns null when path is not /manifest.webmanifest", () => {
    const req = new Request("https://dev.kevinellen.com/other");

    const appState = {} as AppState;

    const result = resolveWebmanifestSystem(req, appState);

    expect(result).toBeNull();
  });

  it("returns manifest from AppState when path matches", () => {
    const req = new Request("https://dev.kevinellen.com/manifest.webmanifest");

    const manifest = {
      name: "Kevin Ellen",
      short_name: "KE",
    };

    const appState = {
      manifest,
    } as unknown as AppState;

    const result = resolveWebmanifestSystem(req, appState);

    expect(result).toBe(manifest);
  });
});
