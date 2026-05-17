// src/request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request.test.ts

import { resolveWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request";

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = (manifest: unknown) =>
  ({
    manifest,
  }) as never;

describe("resolveWebmanifestSystem", () => {
  it("returns null when request is not for manifest.webmanifest", () => {
    const result = resolveWebmanifestSystem(
      createRequest("/journal"),
      createAppState({ name: "Kevin Ellen" }),
    );

    expect(result).toBeNull();
  });

  it("returns the AppState manifest when request is for manifest.webmanifest", () => {
    const manifest = {
      name: "Kevin Ellen",
      short_name: "Kevin",
      start_url: "/",
      display: "standalone",
    };

    const result = resolveWebmanifestSystem(
      createRequest("/manifest.webmanifest"),
      createAppState(manifest),
    );

    expect(result).toBe(manifest);
  });
});
