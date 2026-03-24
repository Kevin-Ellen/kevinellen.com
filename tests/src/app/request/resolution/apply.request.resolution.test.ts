// tests/src/app/request/resolution/apply.request.resolution.test.ts

import type { AppState } from "@app/appState/appState";

import { applyRequestResolution } from "@app/request/resolution/apply.request.resolution";
import { applyRedirectResolution } from "@app/request/resolution/redirects/apply.redirects";
import { applyGoneResolution } from "@app/request/resolution/gone/apply.gone";
import { resolveRobotsRequest } from "@app/system/robots/resolve.robots";
import { resolveXmlSitemapRequest } from "@app/system/xml-sitemap/resolve.xml-sitemap";
import { resolveWebManifestRequest } from "@app/system/webmanifest/resolve.webmanifest";

jest.mock("@app/request/resolution/redirects/apply.redirects", () => ({
  applyRedirectResolution: jest.fn(),
}));

jest.mock("@app/request/resolution/gone/apply.gone", () => ({
  applyGoneResolution: jest.fn(),
}));

jest.mock("@app/system/robots/resolve.robots", () => ({
  resolveRobotsRequest: jest.fn(),
}));

jest.mock("@app/system/xml-sitemap/resolve.xml-sitemap", () => ({
  resolveXmlSitemapRequest: jest.fn(),
}));

jest.mock("@app/system/webmanifest/resolve.webmanifest", () => ({
  resolveWebManifestRequest: jest.fn(),
}));

describe("applyRequestResolution", () => {
  const mockedRedirect = jest.mocked(applyRedirectResolution);
  const mockedGone = jest.mocked(applyGoneResolution);
  const mockedRobots = jest.mocked(resolveRobotsRequest);
  const mockedXmlSitemap = jest.mocked(resolveXmlSitemapRequest);
  const mockedWebManifest = jest.mocked(resolveWebManifestRequest);

  const createRequest = (): Request => new Request("https://kevinellen.com/");

  const createAppState = (): AppState => ({}) as unknown as AppState;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns redirect outcome when redirect resolution short-circuits", async () => {
    const req = createRequest();
    const appState = createAppState();

    const redirectResponse = new Response(null, { status: 301 });

    mockedRedirect.mockReturnValue({
      type: "direct-response",
      responseFormat: "text",
      response: redirectResponse,
    });

    const result = await applyRequestResolution(
      req,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedGone).not.toHaveBeenCalled();
    expect(mockedRobots).not.toHaveBeenCalled();
    expect(mockedXmlSitemap).not.toHaveBeenCalled();
    expect(mockedWebManifest).not.toHaveBeenCalled();

    expect(result).toEqual({
      type: "direct-response",
      responseFormat: "text",
      response: redirectResponse,
    });
  });

  it("returns gone outcome when redirect continues but gone short-circuits", async () => {
    const req = createRequest();
    const appState = createAppState();

    mockedRedirect.mockReturnValue({ type: "continue" });

    mockedGone.mockReturnValue({
      type: "render-error",
      intent: { kind: "gone" },
    });

    const result = await applyRequestResolution(
      req,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedGone).toHaveBeenCalledTimes(1);
    expect(mockedRobots).not.toHaveBeenCalled();
    expect(mockedXmlSitemap).not.toHaveBeenCalled();
    expect(mockedWebManifest).not.toHaveBeenCalled();

    expect(result).toEqual({
      type: "render-error",
      intent: { kind: "gone" },
    });
  });

  it("returns robots outcome when redirect and gone continue but robots short-circuits", async () => {
    const req = createRequest();
    const appState = createAppState();

    const robotsResponse = new Response("User-agent: *\n", {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });

    mockedRedirect.mockReturnValue({ type: "continue" });
    mockedGone.mockReturnValue({ type: "continue" });
    mockedRobots.mockReturnValue({
      type: "direct-response",
      responseFormat: "text",
      response: robotsResponse,
    });

    const result = await applyRequestResolution(
      req,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedGone).toHaveBeenCalledTimes(1);
    expect(mockedRobots).toHaveBeenCalledTimes(1);
    expect(mockedRobots).toHaveBeenCalledWith(req, appState);
    expect(mockedXmlSitemap).not.toHaveBeenCalled();
    expect(mockedWebManifest).not.toHaveBeenCalled();

    expect(result).toEqual({
      type: "direct-response",
      responseFormat: "text",
      response: robotsResponse,
    });
  });

  it("returns sitemap outcome when redirect, gone and robots continue but sitemap short-circuits", async () => {
    const req = createRequest();
    const appState = createAppState();

    const sitemapResponse = new Response(
      '<?xml version="1.0" encoding="UTF-8"?>',
      {
        status: 200,
        headers: {
          "content-type": "application/xml; charset=utf-8",
        },
      },
    );

    mockedRedirect.mockReturnValue({ type: "continue" });
    mockedGone.mockReturnValue({ type: "continue" });
    mockedRobots.mockReturnValue({ type: "continue" });
    mockedXmlSitemap.mockReturnValue({
      type: "direct-response",
      responseFormat: "xml",
      response: sitemapResponse,
    });

    const result = await applyRequestResolution(
      req,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedGone).toHaveBeenCalledTimes(1);
    expect(mockedRobots).toHaveBeenCalledTimes(1);
    expect(mockedXmlSitemap).toHaveBeenCalledTimes(1);
    expect(mockedXmlSitemap).toHaveBeenCalledWith(req, appState);
    expect(mockedWebManifest).not.toHaveBeenCalled();

    expect(result).toEqual({
      type: "direct-response",
      responseFormat: "xml",
      response: sitemapResponse,
    });
  });

  it("returns webmanifest outcome when redirect, gone, robots and sitemap continue but webmanifest short-circuits", async () => {
    const req = createRequest();
    const appState = createAppState();

    const manifestResponse = new Response('{"name":"Kevin Ellen"}', {
      status: 200,
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
      },
    });

    mockedRedirect.mockReturnValue({ type: "continue" });
    mockedGone.mockReturnValue({ type: "continue" });
    mockedRobots.mockReturnValue({ type: "continue" });
    mockedXmlSitemap.mockReturnValue({ type: "continue" });
    mockedWebManifest.mockReturnValue({
      type: "direct-response",
      responseFormat: "json",
      response: manifestResponse,
    });

    const result = await applyRequestResolution(
      req,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedGone).toHaveBeenCalledTimes(1);
    expect(mockedRobots).toHaveBeenCalledTimes(1);
    expect(mockedXmlSitemap).toHaveBeenCalledTimes(1);
    expect(mockedWebManifest).toHaveBeenCalledTimes(1);
    expect(mockedWebManifest).toHaveBeenCalledWith(req, appState);

    expect(result).toEqual({
      type: "direct-response",
      responseFormat: "json",
      response: manifestResponse,
    });
  });

  it("returns continue when all resolution stages continue", async () => {
    const req = createRequest();
    const appState = createAppState();

    mockedRedirect.mockReturnValue({ type: "continue" });
    mockedGone.mockReturnValue({ type: "continue" });
    mockedRobots.mockReturnValue({ type: "continue" });
    mockedXmlSitemap.mockReturnValue({ type: "continue" });
    mockedWebManifest.mockReturnValue({ type: "continue" });

    const result = await applyRequestResolution(
      req,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedGone).toHaveBeenCalledTimes(1);
    expect(mockedRobots).toHaveBeenCalledTimes(1);
    expect(mockedXmlSitemap).toHaveBeenCalledTimes(1);
    expect(mockedWebManifest).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ type: "continue" });
  });

  it("runs resolution stages in deterministic order", async () => {
    const req = createRequest();
    const appState = createAppState();

    const order: string[] = [];

    mockedRedirect.mockImplementation(() => {
      order.push("redirect");
      return { type: "continue" };
    });

    mockedGone.mockImplementation(() => {
      order.push("gone");
      return { type: "continue" };
    });

    mockedRobots.mockImplementation(() => {
      order.push("robots");
      return { type: "continue" };
    });

    mockedXmlSitemap.mockImplementation(() => {
      order.push("xml-sitemap");
      return { type: "continue" };
    });

    mockedWebManifest.mockImplementation(() => {
      order.push("webmanifest");
      return { type: "continue" };
    });

    await applyRequestResolution(
      req,
      {} as Env,
      {} as ExecutionContext,
      appState,
    );

    expect(order).toEqual([
      "redirect",
      "gone",
      "robots",
      "xml-sitemap",
      "webmanifest",
    ]);
  });
});
