// tests/src/request/pre-context/system/robots-txt/robots-txt.render.system.pre-app-context.request.test.ts

import { renderRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.render.system.pre-app-context.request";

describe("renderRobotsTxtSystem", () => {
  it("renders robots.txt with rules and sitemap", async () => {
    const result = renderRobotsTxtSystem({
      sitemapUrl: "https://dev.kevinellen.com/sitemap.xml",
      rules: ["User-agent: *", "Allow: /", "Disallow: /private"],
    });

    expect(result.kind).toBe("direct-response");

    if (result.kind !== "direct-response") {
      throw new Error("Expected direct-response.");
    }

    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );

    const body = await result.response.text();

    expect(body).toBe(
      "User-agent: *\nAllow: /\nDisallow: /private\nSitemap: https://dev.kevinellen.com/sitemap.xml\n",
    );
  });

  it("renders robots.txt without sitemap when sitemapUrl is null", async () => {
    const result = renderRobotsTxtSystem({
      sitemapUrl: null,
      rules: ["User-agent: *", "Allow: /"],
    });

    expect(result.kind).toBe("direct-response");

    if (result.kind !== "direct-response") {
      throw new Error("Expected direct-response.");
    }

    const body = await result.response.text();

    expect(body).toBe("User-agent: *\nAllow: /\n");
  });
});
