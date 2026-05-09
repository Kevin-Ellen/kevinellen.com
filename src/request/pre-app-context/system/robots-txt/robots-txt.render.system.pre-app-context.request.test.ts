// src/request/pre-app-context/system/robots-txt/robots-txt.render.system.pre-app-context.request.test.ts

import { renderRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.render.system.pre-app-context.request";

const expectDirectResponse = (
  result: ReturnType<typeof renderRobotsTxtSystem>,
): Response => {
  expect(result.kind).toBe("direct-response");

  if (result.kind !== "direct-response") {
    throw new Error("Expected direct-response result.");
  }

  return result.response;
};

describe("renderRobotsTxtSystem", () => {
  it("renders robots.txt with sitemap", async () => {
    const result = renderRobotsTxtSystem({
      sitemapUrl: "https://example.com/sitemap.xml",
      rules: ["User-agent: *", "Allow: /", "Disallow: /private"],
    });

    const response = expectDirectResponse(result);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );

    await expect(response.text()).resolves.toBe(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /private",
        "Sitemap: https://example.com/sitemap.xml",
        "",
      ].join("\n"),
    );
  });

  it("renders robots.txt without sitemap", async () => {
    const result = renderRobotsTxtSystem({
      sitemapUrl: null,
      rules: ["User-agent: *", "Allow: /"],
    });

    const response = expectDirectResponse(result);

    await expect(response.text()).resolves.toBe(
      ["User-agent: *", "Allow: /", ""].join("\n"),
    );
  });
});
