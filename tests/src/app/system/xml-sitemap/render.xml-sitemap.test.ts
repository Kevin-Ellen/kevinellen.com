// tests/src/app/system/xml-sitemap/render.xml-sitemap.test.ts

import { renderXmlSitemap } from "@app/system/xml-sitemap/render.xml-sitemap";

describe("renderXmlSitemap", () => {
  it("renders a minimal sitemap document", () => {
    const result = renderXmlSitemap({
      urls: [
        {
          loc: "https://kevinellen.com",
        },
      ],
    });

    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(result).toContain("<url>");
    expect(result).toContain("<loc>https://kevinellen.com</loc>");
    expect(result).toContain("</url>");
    expect(result).toContain("</urlset>");
  });

  it("renders multiple url entries", () => {
    const result = renderXmlSitemap({
      urls: [
        {
          loc: "https://kevinellen.com",
        },
        {
          loc: "https://kevinellen.com/about",
        },
      ],
    });

    expect(result).toContain("<loc>https://kevinellen.com</loc>");
    expect(result).toContain("<loc>https://kevinellen.com/about</loc>");
    expect(result.match(/<url>/g)).toHaveLength(2);
    expect(result.match(/<\/url>/g)).toHaveLength(2);
  });

  it("renders lastmod when present", () => {
    const result = renderXmlSitemap({
      urls: [
        {
          loc: "https://kevinellen.com/articles/example",
          lastmod: "2026-03-23",
        },
      ],
    });

    expect(result).toContain(
      "<loc>https://kevinellen.com/articles/example</loc>",
    );
    expect(result).toContain("<lastmod>2026-03-23</lastmod>");
  });

  it("omits lastmod when not present", () => {
    const result = renderXmlSitemap({
      urls: [
        {
          loc: "https://kevinellen.com/articles/example",
        },
      ],
    });

    expect(result).not.toContain("<lastmod>");
  });

  it("escapes XML special characters in loc", () => {
    const result = renderXmlSitemap({
      urls: [
        {
          loc: "https://kevinellen.com/search?q=birds&sort=asc",
        },
      ],
    });

    expect(result).toContain(
      "<loc>https://kevinellen.com/search?q=birds&amp;sort=asc</loc>",
    );
  });

  it("escapes XML special characters in lastmod when present", () => {
    const result = renderXmlSitemap({
      urls: [
        {
          loc: "https://kevinellen.com/articles/example",
          lastmod: '2026-03-23T10:30:00+00:00 & "draft"',
        },
      ],
    });

    expect(result).toContain(
      "<lastmod>2026-03-23T10:30:00+00:00 &amp; &quot;draft&quot;</lastmod>",
    );
  });
});
