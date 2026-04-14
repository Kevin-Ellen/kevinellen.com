// tests/src/request/pre-app-context/system/sitemap-xml/xml-sitemap.render.system.pre-app-context.request.test.ts

import { renderXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.render.system.pre-app-context.request";

describe("renderXmlSitemapSystem", () => {
  it("renders sitemap xml response", async () => {
    const result = renderXmlSitemapSystem({
      urls: [
        "https://dev.kevinellen.com/",
        "https://dev.kevinellen.com/legal/privacy",
      ],
    });

    expect(result.kind).toBe("direct-response");

    if (result.kind !== "direct-response") {
      throw new Error("Expected direct-response.");
    }

    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("content-type")).toBe(
      "application/xml; charset=utf-8",
    );

    const body = await result.response.text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain("<urlset");
    expect(body).toContain("<loc>https://dev.kevinellen.com/</loc>");
    expect(body).toContain(
      "<loc>https://dev.kevinellen.com/legal/privacy</loc>",
    );
  });
});
