// src/app/life-cycle/system/robots-txt/robots-txt.system.test.ts

import type { AppInit } from "../../app-init/class.app-init";

import { resolveRobotsTxtSystem } from "./robots-txt.system";

describe("Robots.txt system", () => {
  const sitemapUrl = "https://kevinellen.com/sitemap.xml";

  const resolve = (robotsTxt: AppInit["robotsTxt"]) =>
    resolveRobotsTxtSystem({
      appInit: { robotsTxt } as AppInit,
    });

  it("renders a standard robots.txt", () => {
    const response = resolve({
      sitemapUrl,
      groups: [
        {
          userAgents: ["*"],
          allow: ["/"],
          disallow: ["/private/"],
          crawlDelay: null,
        },
      ],
    });

    expect(response).toEqual({
      kind: "txt",
      status: 200,
      body: [
        "User-agent: *",
        "Allow: /",
        "Disallow: /private/",
        "",
        `Sitemap: ${sitemapUrl}`,
        "",
      ].join("\n"),
    });
  });

  it("renders multiple user agents", () => {
    const response = resolve({
      sitemapUrl,
      groups: [
        {
          userAgents: ["Googlebot", "Bingbot"],
          allow: ["/journals/", "/photography/"],
          disallow: ["/admin/", "/internal/"],
          crawlDelay: null,
        },
      ],
    });

    expect(response.body).toBe(
      [
        "User-agent: Googlebot",
        "User-agent: Bingbot",
        "Allow: /journals/",
        "Allow: /photography/",
        "Disallow: /admin/",
        "Disallow: /internal/",
        "",
        `Sitemap: ${sitemapUrl}`,
        "",
      ].join("\n"),
    );
  });

  it("renders multiple groups in order", () => {
    const response = resolve({
      sitemapUrl,
      groups: [
        {
          userAgents: ["*"],
          allow: ["/"],
          disallow: [],
          crawlDelay: null,
        },
        {
          userAgents: ["ExampleBot"],
          allow: [],
          disallow: ["/"],
          crawlDelay: 10,
        },
      ],
    });

    expect(response.body).toBe(
      [
        "User-agent: *",
        "Allow: /",
        "",
        "User-agent: ExampleBot",
        "Disallow: /",
        "Crawl-delay: 10",
        "",
        `Sitemap: ${sitemapUrl}`,
        "",
      ].join("\n"),
    );
  });

  it("omits crawl delay when null", () => {
    const response = resolve({
      sitemapUrl,
      groups: [
        {
          userAgents: ["*"],
          allow: [],
          disallow: [],
          crawlDelay: null,
        },
      ],
    });

    expect(response.body).not.toContain("Crawl-delay:");
  });

  it("renders crawl delay when configured", () => {
    const response = resolve({
      sitemapUrl,
      groups: [
        {
          userAgents: ["ExampleBot"],
          allow: [],
          disallow: [],
          crawlDelay: 5,
        },
      ],
    });

    expect(response.body).toContain("Crawl-delay: 5");
  });

  it("preserves zero crawl delay", () => {
    const response = resolve({
      sitemapUrl,
      groups: [
        {
          userAgents: ["ExampleBot"],
          allow: [],
          disallow: [],
          crawlDelay: 0,
        },
      ],
    });

    expect(response.body).toContain("Crawl-delay: 0");
  });

  it("renders an empty group list", () => {
    const response = resolve({
      sitemapUrl,
      groups: [],
    });

    expect(response).toEqual({
      kind: "txt",
      status: 200,
      body: `Sitemap: ${sitemapUrl}\n`,
    });
  });

  it("ends with exactly one newline", () => {
    const response = resolve({
      sitemapUrl,
      groups: [],
    });

    expect(response.body.endsWith("\n")).toBe(true);
    expect(response.body.endsWith("\n\n")).toBe(false);
  });
});
