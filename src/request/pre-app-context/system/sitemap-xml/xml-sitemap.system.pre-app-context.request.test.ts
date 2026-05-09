// src/request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request.test.ts

import { xmlSitemapSystemOrchestrator } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.system.pre-app-context.request";

const createEnv = (): Env => ({ APP_ENV: "prod" }) as Env;

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = (publicPages: unknown[] = []) =>
  ({
    siteConfig: {
      origin: "https://example.com",
    },
    publicPages,
  }) as never;

const expectDirectResponse = (
  result: ReturnType<typeof xmlSitemapSystemOrchestrator>,
): Response => {
  expect(result).toMatchObject({ kind: "direct-response" });

  if (result?.kind !== "direct-response") {
    throw new Error("Expected direct-response result.");
  }

  return result.response;
};

describe("xmlSitemapSystemOrchestrator", () => {
  it("returns null when request is not for sitemap.xml", () => {
    const result = xmlSitemapSystemOrchestrator(
      createRequest("/journal"),
      createEnv(),
      createAppState(),
    );

    expect(result).toBeNull();
  });

  it("returns rendered sitemap XML response when request is for sitemap.xml", async () => {
    const result = xmlSitemapSystemOrchestrator(
      createRequest("/sitemap.xml"),
      createEnv(),
      createAppState([
        {
          id: "home",
          slug: "/",
          sitemapXml: { include: true },
        },
      ]),
    );

    const response = expectDirectResponse(result);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/xml; charset=utf-8",
    );

    await expect(response.text()).resolves.toContain(
      "<url><loc>https://example.com/</loc></url>",
    );
  });
});
