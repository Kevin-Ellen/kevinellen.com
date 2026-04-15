// tests/src/request/pre-app-context/system/system.pre-app-context.request.test.ts

import { preAppContextSystemOrchestrator } from "@request/pre-app-context/system/system.pre-app-context.request";
import { robotsTxtSystemOrchestrator } from "@request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request";
import { xmlSitemapSystemOrchestrator } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request";
import { webmanifestSystemOrchestrator } from "@request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

jest.mock(
  "@request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request",
  () => ({
    robotsTxtSystemOrchestrator: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request",
  () => ({
    xmlSitemapSystemOrchestrator: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/webmanifest/webmanifest.system.pre-app-context.request",
  () => ({
    webmanifestSystemOrchestrator: jest.fn(),
  }),
);

describe("preAppContextSystemOrchestrator", () => {
  const mockedRobotsTxt = jest.mocked(robotsTxtSystemOrchestrator);
  const mockedXmlSitemap = jest.mocked(xmlSitemapSystemOrchestrator);
  const mockedWebmanifest = jest.mocked(webmanifestSystemOrchestrator);

  const env = {} as Env;
  const appState = {} as AppState;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the robots.txt result when present", () => {
    const req = new Request("https://dev.kevinellen.com/robots.txt");
    const resultValue = {
      kind: "direct-response",
      response: new Response("robots"),
    } as const;

    mockedRobotsTxt.mockReturnValue(resultValue);
    mockedXmlSitemap.mockReturnValue(null);
    mockedWebmanifest.mockReturnValue(null);

    const result = preAppContextSystemOrchestrator(req, env, appState);

    expect(result).toBe(resultValue);
    expect(mockedRobotsTxt).toHaveBeenCalledWith(req, env, appState);
    expect(mockedXmlSitemap).not.toHaveBeenCalled();
    expect(mockedWebmanifest).not.toHaveBeenCalled();
  });

  it("returns the sitemap result when robots.txt does not match", () => {
    const req = new Request("https://dev.kevinellen.com/sitemap.xml");
    const resultValue = {
      kind: "direct-response",
      response: new Response("sitemap"),
    } as const;

    mockedRobotsTxt.mockReturnValue(null);
    mockedXmlSitemap.mockReturnValue(resultValue);
    mockedWebmanifest.mockReturnValue(null);

    const result = preAppContextSystemOrchestrator(req, env, appState);

    expect(result).toBe(resultValue);
    expect(mockedRobotsTxt).toHaveBeenCalledWith(req, env, appState);
    expect(mockedXmlSitemap).toHaveBeenCalledWith(req, env, appState);
    expect(mockedWebmanifest).not.toHaveBeenCalled();
  });

  it("returns the webmanifest result when only webmanifest matches", () => {
    const req = new Request("https://dev.kevinellen.com/manifest.webmanifest");
    const resultValue = {
      kind: "direct-response",
      response: new Response("manifest"),
    } as const;

    mockedRobotsTxt.mockReturnValue(null);
    mockedXmlSitemap.mockReturnValue(null);
    mockedWebmanifest.mockReturnValue(resultValue);

    const result = preAppContextSystemOrchestrator(req, env, appState);

    expect(result).toBe(resultValue);
    expect(mockedRobotsTxt).toHaveBeenCalledWith(req, env, appState);
    expect(mockedXmlSitemap).toHaveBeenCalledWith(req, env, appState);
    expect(mockedWebmanifest).toHaveBeenCalledWith(req, env, appState);
  });

  it("returns null when no system route matches", () => {
    const req = new Request("https://dev.kevinellen.com/other");

    mockedRobotsTxt.mockReturnValue(null);
    mockedXmlSitemap.mockReturnValue(null);
    mockedWebmanifest.mockReturnValue(null);

    const result = preAppContextSystemOrchestrator(req, env, appState);

    expect(result).toBeNull();
    expect(mockedRobotsTxt).toHaveBeenCalledWith(req, env, appState);
    expect(mockedXmlSitemap).toHaveBeenCalledWith(req, env, appState);
    expect(mockedWebmanifest).toHaveBeenCalledWith(req, env, appState);
  });
});
