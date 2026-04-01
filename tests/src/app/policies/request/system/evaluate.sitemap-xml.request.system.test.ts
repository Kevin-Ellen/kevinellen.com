// tests/src/app/policies/request/system/evaluate.sitemap-xml.request.system.test.ts

import type { AppState } from "@app/appState/class.appState";

import { evaluateSitemapXmlRequestSystem } from "@app/policies/request/system/evaluate.sitemap-xml.request.system";
import { buildSitemapXmlSystem } from "@app/policies/request/system/build.sitemap-xml.request.system";

jest.mock(
  "@app/policies/request/system/build.sitemap-xml.request.system",
  () => ({
    buildSitemapXmlSystem: jest.fn(),
  }),
);

describe("evaluateSitemapXmlRequestSystem", () => {
  const env = {} as Env;
  const appState = {} as AppState;

  const mockedBuildSitemapXmlSystem =
    buildSitemapXmlSystem as jest.MockedFunction<typeof buildSitemapXmlSystem>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns continue when pathname is not /sitemap.xml", () => {
    const req = new Request("https://example.com/test");

    const result = evaluateSitemapXmlRequestSystem(req, env, appState);

    expect(result).toEqual({ kind: "continue" });
    expect(mockedBuildSitemapXmlSystem).not.toHaveBeenCalled();
  });

  it("returns direct-response for /sitemap.xml", async () => {
    const req = new Request("https://example.com/sitemap.xml");

    mockedBuildSitemapXmlSystem.mockReturnValue(
      '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>',
    );

    const result = evaluateSitemapXmlRequestSystem(req, env, appState);

    expect(result.kind).toBe("direct-response");

    if (result.kind !== "direct-response") {
      throw new Error("Expected direct-response");
    }

    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("content-type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(await result.response.text()).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>',
    );
    expect(mockedBuildSitemapXmlSystem).toHaveBeenCalledWith(appState);
  });
});
