// tests/src/app/system/robots/resolve.robots.test.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { resolveRobotsRequest } from "@app/system/robots/resolve.robots";

const expectDirectResponseOutcome = (
  result: RequestResolutionOutcome,
): Extract<RequestResolutionOutcome, { type: "direct-response" }> => {
  if (result.type !== "direct-response") {
    throw new Error("Expected direct-response outcome");
  }

  return result;
};

describe("resolveRobotsRequest", () => {
  const createAppState = (): AppState =>
    ({
      getSiteConfig: jest.fn(() => ({
        siteUrl: "https://kevinellen.com",
      })),
    }) as unknown as AppState;

  it("returns continue for non-robots paths", () => {
    const req = new Request("https://kevinellen.com/about");
    const appState = createAppState();

    const result = resolveRobotsRequest(req, appState);

    expect(result).toEqual({ type: "continue" });
  });

  it("does not read app state for non-robots paths", () => {
    const req = new Request("https://kevinellen.com/about");
    const appState = createAppState();

    resolveRobotsRequest(req, appState);

    expect(appState.getSiteConfig).not.toHaveBeenCalled();
  });

  it("returns a direct text response for /robots.txt", async () => {
    const req = new Request("https://kevinellen.com/robots.txt");
    const appState = createAppState();

    const result = resolveRobotsRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(outcome.responseFormat).toBe("text");
    expect(outcome.response.status).toBe(200);
    expect(outcome.response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );

    await expect(outcome.response.text()).resolves.toBe(
      [
        "User-agent: *",
        "",
        "Sitemap: https://kevinellen.com/sitemap.xml",
        "",
      ].join("\n"),
    );
  });

  it("reads app state once for robots requests", () => {
    const req = new Request("https://kevinellen.com/robots.txt");
    const appState = createAppState();

    resolveRobotsRequest(req, appState);

    expect(appState.getSiteConfig).toHaveBeenCalledTimes(1);
  });

  it("matches /robots.txt exactly", () => {
    const req = new Request("https://kevinellen.com/robots.txt/extra");
    const appState = createAppState();

    const result = resolveRobotsRequest(req, appState);

    expect(result).toEqual({ type: "continue" });
  });

  it("preserves query-string irrelevance by matching pathname only", () => {
    const req = new Request("https://kevinellen.com/robots.txt?foo=bar");
    const appState = createAppState();

    const result = resolveRobotsRequest(req, appState);

    expect(result.type).toBe("direct-response");
  });

  it("sets only the expected content-type header for robots responses", () => {
    const req = new Request("https://kevinellen.com/robots.txt");
    const appState = createAppState();

    const result = resolveRobotsRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(Object.fromEntries(outcome.response.headers.entries())).toEqual({
      "content-type": "text/plain; charset=utf-8",
    });
  });

  it("exposes robots response headers in a case-insensitive way", () => {
    const req = new Request("https://kevinellen.com/robots.txt");
    const appState = createAppState();

    const result = resolveRobotsRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(outcome.response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
  });
});
