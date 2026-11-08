// src/app/life-cycle/response/xml/xml.response.test.ts

import type { XmlResponseOutput } from "../../../types/response/response.shared.type";

import { handleXmlResponse } from "./xml.response";

describe("XML response", () => {
  const createDocument = (
    overrides: Partial<XmlResponseOutput> = {},
  ): XmlResponseOutput => ({
    kind: "xml",
    status: 200,
    body: '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>',
    ...overrides,
  });

  it("returns the configured status and body", async () => {
    const body = "<urlset><url></url></urlset>";

    const response = handleXmlResponse({
      document: createDocument({
        status: 200,
        body,
      }),
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(body);
  });

  it("sets the default XML content type", () => {
    const response = handleXmlResponse({
      document: createDocument(),
    });

    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
  });

  it("preserves custom headers while enforcing no-store", () => {
    const response = handleXmlResponse({
      document: createDocument({
        headers: {
          "Cache-Control": "public, max-age=600",
          "X-Test": "sitemap",
        },
      }),
    });

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Test")).toBe("sitemap");
  });

  it("disables caching by default", () => {
    const response = handleXmlResponse({
      document: createDocument(),
    });

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("allows content type overrides", () => {
    const response = handleXmlResponse({
      document: createDocument({
        headers: {
          "Content-Type": "application/xml",
        },
      }),
    });

    expect(response.headers.get("Content-Type")).toBe("application/xml");
  });

  it("preserves image sitemap namespaces", async () => {
    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      "<url>",
      "<loc>https://kevinellen.com/journal/example</loc>",
      "</url>",
      "</urlset>",
    ].join("\n");

    const response = handleXmlResponse({
      document: createDocument({ body }),
    });

    expect(await response.text()).toBe(body);
  });

  it("supports empty XML response bodies", async () => {
    const response = handleXmlResponse({
      document: createDocument({ body: "" }),
    });

    expect(await response.text()).toBe("");
  });
});
