// tests/src/app/system/webmanifest/resolve.webmanifest.test.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { resolveWebManifestRequest } from "@app/system/webmanifest/resolve.webmanifest";

const expectDirectResponseOutcome = (
  result: RequestResolutionOutcome,
): Extract<RequestResolutionOutcome, { type: "direct-response" }> => {
  if (result.type !== "direct-response") {
    throw new Error("Expected direct-response outcome");
  }

  return result;
};

describe("resolveWebManifestRequest", () => {
  const createAppState = (): AppState =>
    ({
      getWebManifestConfig: jest.fn(() => ({
        name: "Kevin Ellen",
        shortName: "Kevin Ellen",
        description:
          "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
        themeColor: "#1f2621",
        backgroundColor: "#1f2621",
        display: "standalone",
      })),
    }) as unknown as AppState;

  it("returns continue for non-manifest paths", () => {
    const req = new Request("https://kevinellen.com/about");
    const appState = createAppState();

    const result = resolveWebManifestRequest(req, appState);

    expect(result).toEqual({ type: "continue" });
  });

  it("does not read app state for non-manifest paths", () => {
    const req = new Request("https://kevinellen.com/about");
    const appState = createAppState();

    resolveWebManifestRequest(req, appState);

    expect(appState.getWebManifestConfig).not.toHaveBeenCalled();
  });

  it("returns a direct json response for /site.webmanifest", async () => {
    const req = new Request("https://kevinellen.com/site.webmanifest");
    const appState = createAppState();

    const result = resolveWebManifestRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(outcome.responseFormat).toBe("json");
    expect(outcome.response.status).toBe(200);
    expect(outcome.response.headers.get("content-type")).toBe(
      "application/manifest+json; charset=utf-8",
    );

    const body = await outcome.response.text();
    const parsed = JSON.parse(body);

    expect(parsed).toEqual({
      name: "Kevin Ellen",
      shortName: "Kevin Ellen",
      description:
        "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
      startUrl: "/",
      display: "standalone",
      backgroundColor: "#1f2621",
      themeColor: "#1f2621",
      icons: [
        {
          src: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
  });

  it("reads app state once for manifest requests", () => {
    const req = new Request("https://kevinellen.com/site.webmanifest");
    const appState = createAppState();

    resolveWebManifestRequest(req, appState);

    expect(appState.getWebManifestConfig).toHaveBeenCalledTimes(1);
  });

  it("matches /site.webmanifest exactly", () => {
    const req = new Request("https://kevinellen.com/site.webmanifest/extra");
    const appState = createAppState();

    const result = resolveWebManifestRequest(req, appState);

    expect(result).toEqual({ type: "continue" });
  });

  it("preserves query-string irrelevance by matching pathname only", () => {
    const req = new Request("https://kevinellen.com/site.webmanifest?foo=bar");
    const appState = createAppState();

    const result = resolveWebManifestRequest(req, appState);

    expect(result.type).toBe("direct-response");
  });

  it("sets only the expected content-type header for manifest responses", () => {
    const req = new Request("https://kevinellen.com/site.webmanifest");
    const appState = createAppState();

    const result = resolveWebManifestRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(Object.fromEntries(outcome.response.headers.entries())).toEqual({
      "content-type": "application/manifest+json; charset=utf-8",
    });
  });

  it("exposes manifest response headers in a case-insensitive way", () => {
    const req = new Request("https://kevinellen.com/site.webmanifest");
    const appState = createAppState();

    const result = resolveWebManifestRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(outcome.response.headers.get("Content-Type")).toBe(
      "application/manifest+json; charset=utf-8",
    );
  });
});
