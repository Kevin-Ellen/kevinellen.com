// tests/src/request/pre-context/system/xml-sitemap/xml-sitemap.system.pre-app-context.request.test.ts

import { xmlSitemapSystemOrchestrator } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request";
import { resolveXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request";
import { renderXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.render.system.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

jest.mock(
  "@request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request",
  () => ({
    resolveXmlSitemapSystem: jest.fn(),
  }),
);

jest.mock(
  "@request/pre-app-context/system/sitemap-xml/xml-sitemap.render.system.pre-app-context.request",
  () => ({
    renderXmlSitemapSystem: jest.fn(),
  }),
);

describe("xmlSitemapSystemOrchestrator", () => {
  const mockedResolveXmlSitemapSystem = jest.mocked(resolveXmlSitemapSystem);
  const mockedRenderXmlSitemapSystem = jest.mocked(renderXmlSitemapSystem);

  const env = {} as Env;
  const appState = {} as AppState;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when the resolver does not match the request", () => {
    const req = new Request("https://dev.kevinellen.com/not-sitemap.xml");

    mockedResolveXmlSitemapSystem.mockReturnValue(null);

    const result = xmlSitemapSystemOrchestrator(req, env, appState);

    expect(result).toBeNull();
    expect(mockedResolveXmlSitemapSystem).toHaveBeenCalledWith(req, appState);
    expect(mockedRenderXmlSitemapSystem).not.toHaveBeenCalled();
  });

  it("renders and returns the sitemap response when the resolver matches", () => {
    const req = new Request("https://dev.kevinellen.com/sitemap.xml");

    const resolved = {
      urls: [
        "https://dev.kevinellen.com/",
        "https://dev.kevinellen.com/legal/privacy",
      ],
    } as const;

    const renderedResult = {
      kind: "direct-response",
      response: new Response("xml", {
        status: 200,
        headers: {
          "content-type": "application/xml; charset=utf-8",
        },
      }),
    } as const;

    mockedResolveXmlSitemapSystem.mockReturnValue(resolved);
    mockedRenderXmlSitemapSystem.mockReturnValue(renderedResult);

    const result = xmlSitemapSystemOrchestrator(req, env, appState);

    expect(mockedResolveXmlSitemapSystem).toHaveBeenCalledWith(req, appState);
    expect(mockedRenderXmlSitemapSystem).toHaveBeenCalledWith(resolved);
    expect(result).toBe(renderedResult);
  });
});
