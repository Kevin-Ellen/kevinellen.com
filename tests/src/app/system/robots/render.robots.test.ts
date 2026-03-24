// tests/src/app/system/robots/render.robots.test.ts

import { renderRobotsDocument } from "@app/system/robots/render.robots";

describe("renderRobotsDocument", () => {
  it("renders a minimal robots document with user-agent and sitemap", () => {
    const result = renderRobotsDocument({
      rules: [{ userAgent: "*" }],
      sitemaps: ["https://kevinellen.com/sitemap.xml"],
    });

    expect(result).toBe(
      [
        "User-agent: *",
        "",
        "Sitemap: https://kevinellen.com/sitemap.xml",
        "",
      ].join("\n"),
    );
  });

  it("renders allow and disallow directives when present", () => {
    const result = renderRobotsDocument({
      rules: [
        {
          userAgent: "*",
          allow: ["/public"],
          disallow: ["/private", "/tmp"],
        },
      ],
      sitemaps: [],
    });

    expect(result).toBe(
      [
        "User-agent: *",
        "Allow: /public",
        "Disallow: /private",
        "Disallow: /tmp",
        "",
      ].join("\n"),
    );
  });

  it("renders multiple rules separated by a blank line", () => {
    const result = renderRobotsDocument({
      rules: [
        { userAgent: "*", disallow: ["/private"] },
        { userAgent: "Googlebot", allow: ["/"] },
      ],
      sitemaps: [],
    });

    expect(result).toBe(
      [
        "User-agent: *",
        "Disallow: /private",
        "",
        "User-agent: Googlebot",
        "Allow: /",
        "",
      ].join("\n"),
    );
  });

  it("renders multiple sitemaps on separate lines", () => {
    const result = renderRobotsDocument({
      rules: [{ userAgent: "*" }],
      sitemaps: [
        "https://kevinellen.com/sitemap.xml",
        "https://kevinellen.com/blog-sitemap.xml",
      ],
    });

    expect(result).toBe(
      [
        "User-agent: *",
        "",
        "Sitemap: https://kevinellen.com/sitemap.xml",
        "Sitemap: https://kevinellen.com/blog-sitemap.xml",
        "",
      ].join("\n"),
    );
  });

  it("renders only sitemap block when no rules exist", () => {
    const result = renderRobotsDocument({
      rules: [],
      sitemaps: ["https://kevinellen.com/sitemap.xml"],
    });

    expect(result).toBe(
      ["Sitemap: https://kevinellen.com/sitemap.xml", ""].join("\n"),
    );
  });

  it("renders an empty document safely", () => {
    const result = renderRobotsDocument({
      rules: [],
      sitemaps: [],
    });

    expect(result).toBe("\n");
  });

  it("always ends with a trailing newline", () => {
    const result = renderRobotsDocument({
      rules: [{ userAgent: "*" }],
      sitemaps: [],
    });

    expect(result.endsWith("\n")).toBe(true);
  });
});
