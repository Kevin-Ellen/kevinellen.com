// src/request/pre-app-context/system/sitemap-xml/xml-sitemap.render.system.pre-app-context.request.test.ts

import { renderXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.render.system.pre-app-context.request";

const expectDirectResponse = (
  result: ReturnType<typeof renderXmlSitemapSystem>,
): Response => {
  expect(result.kind).toBe("direct-response");

  if (result.kind !== "direct-response") {
    throw new Error("Expected direct-response result.");
  }

  return result.response;
};

describe("renderXmlSitemapSystem", () => {
  it("renders sitemap XML", async () => {
    const result = renderXmlSitemapSystem({
      urls: ["https://example.com/", "https://example.com/journal"],
    });

    const response = expectDirectResponse(result);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/xml; charset=utf-8",
    );

    await expect(response.text()).resolves
      .toBe(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/</loc></url>
  <url><loc>https://example.com/journal</loc></url>
</urlset>
`);
  });

  it("escapes XML special characters in URLs", async () => {
    const result = renderXmlSitemapSystem({
      urls: [`https://example.com/search?q=a&name=<Kevin>"'`],
    });

    const response = expectDirectResponse(result);

    await expect(response.text()).resolves.toContain(
      "https://example.com/search?q=a&amp;name=&lt;Kevin&gt;&quot;&apos;",
    );
  });

  it("renders an empty urlset when there are no URLs", async () => {
    const result = renderXmlSitemapSystem({
      urls: [],
    });

    const response = expectDirectResponse(result);

    await expect(response.text()).resolves
      .toBe(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

</urlset>
`);
  });
});
