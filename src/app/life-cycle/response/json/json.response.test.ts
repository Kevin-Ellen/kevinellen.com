// src/app/life-cycle/response/json/json.response.test.ts

import type { JsonResponseOutput } from "../../../types/response/response.shared.type";

import { handleJsonResponse } from "./json.response";

describe("JSON response", () => {
  const createDocument = (
    overrides: Partial<JsonResponseOutput> = {},
  ): JsonResponseOutput => ({
    kind: "json",
    status: 200,
    body: '{"success":true}',
    ...overrides,
  });

  it("returns the expected status and body", async () => {
    const response = handleJsonResponse({
      document: createDocument({
        status: 201,
        body: '{"created":true}',
      }),
    });

    expect(response.status).toBe(201);
    expect(await response.text()).toBe('{"created":true}');
  });

  it("sets the default JSON content type", () => {
    const response = handleJsonResponse({
      document: createDocument(),
    });

    expect(response.headers.get("Content-Type")).toBe(
      "application/json; charset=utf-8",
    );
  });

  it("preserves custom headers", () => {
    const response = handleJsonResponse({
      document: createDocument({
        headers: {
          "X-Test": "custom-value",
          "Cache-Control": "public, max-age=300",
        },
      }),
    });

    expect(response.headers.get("X-Test")).toBe("custom-value");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=300");
  });

  it("allows content type overrides", () => {
    const response = handleJsonResponse({
      document: createDocument({
        headers: {
          "Content-Type": "application/problem+json",
        },
      }),
    });

    expect(response.headers.get("Content-Type")).toBe(
      "application/problem+json",
    );
  });

  it("does not serialize the body again", async () => {
    const body = '{"message":"Already serialized"}';

    const response = handleJsonResponse({
      document: createDocument({ body }),
    });

    expect(await response.text()).toBe(body);
  });
});
