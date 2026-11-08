// src/app/life-cycle/response/text/text.response.test.ts

import type { TextResponseOutput } from "../../../types/response/response.shared.type";

import { handleTextResponse } from "./text.response";

describe("Text response", () => {
  const createDocument = (
    overrides: Partial<TextResponseOutput> = {},
  ): TextResponseOutput => ({
    kind: "txt",
    status: 200,
    body: "Hello world",
    ...overrides,
  });

  it("returns the configured status and body", async () => {
    const response = handleTextResponse({
      document: createDocument({
        status: 404,
        body: "Not found",
      }),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not found");
  });

  it("sets the default plain text content type", () => {
    const response = handleTextResponse({
      document: createDocument(),
    });

    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
  });

  it("preserves custom headers", () => {
    const response = handleTextResponse({
      document: createDocument({
        headers: {
          "Cache-Control": "public, max-age=3600",
          "X-Robots-Tag": "noindex",
        },
      }),
    });

    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");

    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("allows content type overrides", () => {
    const response = handleTextResponse({
      document: createDocument({
        headers: {
          "Content-Type": "text/plain; charset=us-ascii",
        },
      }),
    });

    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=us-ascii",
    );
  });

  it("preserves robots.txt formatting", async () => {
    const body = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /private/",
      "",
      "Sitemap: https://kevinellen.com/sitemap.xml",
      "",
    ].join("\n");

    const response = handleTextResponse({
      document: createDocument({ body }),
    });

    expect(await response.text()).toBe(body);
  });

  it("supports empty response bodies", async () => {
    const response = handleTextResponse({
      document: createDocument({ body: "" }),
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });
});
