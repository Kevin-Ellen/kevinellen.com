// src/request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request.test.ts

import { webmanifestSystemOrchestrator } from "@request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request";

const createEnv = (): Env => ({ APP_ENV: "prod" }) as Env;

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = (manifest: unknown = null) =>
  ({
    manifest,
  }) as never;

const expectDirectResponse = (
  result: ReturnType<typeof webmanifestSystemOrchestrator>,
): Response => {
  expect(result).toMatchObject({ kind: "direct-response" });

  if (result?.kind !== "direct-response") {
    throw new Error("Expected direct-response result.");
  }

  return result.response;
};

describe("webmanifestSystemOrchestrator", () => {
  it("returns null when request is not for manifest.webmanifest", () => {
    const result = webmanifestSystemOrchestrator(
      createRequest("/journal"),
      createEnv(),
      createAppState({ name: "Kevin Ellen" }),
    );

    expect(result).toBeNull();
  });

  it("returns rendered webmanifest response when request is for manifest.webmanifest", async () => {
    const manifest = {
      name: "Kevin Ellen",
      short_name: "Kevin",
      start_url: "/",
      display: "standalone",
    };

    const result = webmanifestSystemOrchestrator(
      createRequest("/manifest.webmanifest"),
      createEnv(),
      createAppState(manifest),
    );

    const response = expectDirectResponse(result);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/manifest+json; charset=utf-8",
    );

    await expect(response.json()).resolves.toEqual(manifest);
  });
});
