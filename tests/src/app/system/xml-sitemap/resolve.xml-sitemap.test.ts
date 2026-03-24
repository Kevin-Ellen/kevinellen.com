// tests/src/app/system/xml-sitemap/resolve.xml-sitemap.test.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { resolveXmlSitemapRequest } from "@app/system/xml-sitemap/resolve.xml-sitemap";

const expectDirectResponseOutcome = (
  result: RequestResolutionOutcome,
): Extract<RequestResolutionOutcome, { type: "direct-response" }> => {
  if (result.type !== "direct-response") {
    throw new Error("Expected direct-response outcome");
  }

  return result;
};

describe("resolveXmlSitemapRequest", () => {
  const createAppState = (): AppState =>
    ({
      getSiteConfig: jest.fn(() => ({
        siteUrl: "https://kevinellen.com",
      })),
    }) as unknown as AppState;

  it("returns continue for non-sitemap paths", () => {
    const req = new Request("https://kevinellen.com/about");
    const appState = createAppState();

    const result = resolveXmlSitemapRequest(req, appState);

    expect(result).toEqual({ type: "continue" });
  });

  it("does not read app state for non-sitemap paths", () => {
    const req = new Request("https://kevinellen.com/about");
    const appState = createAppState();

    resolveXmlSitemapRequest(req, appState);

    expect(appState.getSiteConfig).not.toHaveBeenCalled();
  });

  it("returns a direct xml response for /sitemap.xml", async () => {
    const req = new Request("https://kevinellen.com/sitemap.xml");
    const appState = createAppState();

    const result = resolveXmlSitemapRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(outcome.responseFormat).toBe("xml");
    expect(outcome.response.status).toBe(200);
    expect(outcome.response.headers.get("content-type")).toBe(
      "application/xml; charset=utf-8",
    );

    const body = await outcome.response.text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(body).toContain("<loc>https://kevinellen.com</loc>");
    expect(body).toContain("</urlset>");
  });

  it("reads app state once for sitemap requests", () => {
    const req = new Request("https://kevinellen.com/sitemap.xml");
    const appState = createAppState();

    resolveXmlSitemapRequest(req, appState);

    expect(appState.getSiteConfig).toHaveBeenCalledTimes(1);
  });

  it("matches /sitemap.xml exactly", () => {
    const req = new Request("https://kevinellen.com/sitemap.xml/extra");
    const appState = createAppState();

    const result = resolveXmlSitemapRequest(req, appState);

    expect(result).toEqual({ type: "continue" });
  });

  it("preserves query-string irrelevance by matching pathname only", () => {
    const req = new Request("https://kevinellen.com/sitemap.xml?foo=bar");
    const appState = createAppState();

    const result = resolveXmlSitemapRequest(req, appState);

    expect(result.type).toBe("direct-response");
  });

  it("sets only the expected content-type header for sitemap responses", () => {
    const req = new Request("https://kevinellen.com/sitemap.xml");
    const appState = createAppState();

    const result = resolveXmlSitemapRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(Object.fromEntries(outcome.response.headers.entries())).toEqual({
      "content-type": "application/xml; charset=utf-8",
    });
  });

  it("exposes sitemap response headers in a case-insensitive way", () => {
    const req = new Request("https://kevinellen.com/sitemap.xml");
    const appState = createAppState();

    const result = resolveXmlSitemapRequest(req, appState);
    const outcome = expectDirectResponseOutcome(result);

    expect(outcome.response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
  });
});
