// tests/src/app/policies/response/content-type/apply.content-type.response.policies.test.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type {
  ResponseFormat,
  ResponseKind,
} from "@app/appContext/appContext.types";

import { AppContext } from "@app/appContext/appContext";
import { applyContentTypeResponsePolicies } from "@app/policies/response/content-type/apply.content-type.response.policies";

describe("applyContentTypeResponsePolicies", () => {
  const createAppContext = ({
    responseFormat,
    responseKind = "direct",
  }: {
    responseFormat: ResponseFormat;
    responseKind?: ResponseKind;
  }): AppContext =>
    new AppContext({
      responseKind,
      responseFormat,
      env: {} as Env,
    });

  const createContext = ({
    response,
    responseFormat,
    responseKind = "direct",
  }: {
    response: Response;
    responseFormat: ResponseFormat;
    responseKind?: ResponseKind;
  }): ResponsePolicyContext => ({
    response,
    appContext: createAppContext({ responseFormat, responseKind }),
  });

  const createResponse = (): Response =>
    new Response("hello", {
      status: 201,
      statusText: "Created",
      headers: {
        "x-custom-header": "value",
      },
    });

  describe("managed content types", () => {
    it.each([
      ["html", "text/html; charset=utf-8"],
      ["json", "application/json; charset=utf-8"],
      ["xml", "application/xml; charset=utf-8"],
      ["text", "text/plain; charset=utf-8"],
      ["ico", "image/x-icon"],
      ["woff2", "font/woff2"],
    ] as const)(
      "sets %s content-type to %s",
      (responseFormat, expectedContentType) => {
        const context = createContext({
          response: createResponse(),
          responseFormat,
        });

        const result = applyContentTypeResponsePolicies(context);

        expect(result.headers.get("content-type")).toBe(expectedContentType);
      },
    );

    it("overwrites an existing content-type header for managed formats", () => {
      const response = new Response("hello", {
        status: 200,
        headers: {
          "content-type": "application/octet-stream",
          "x-custom-header": "value",
        },
      });

      const context = createContext({
        response,
        responseFormat: "json",
      });

      const result = applyContentTypeResponsePolicies(context);

      expect(result.headers.get("content-type")).toBe(
        "application/json; charset=utf-8",
      );
    });

    it("preserves unrelated headers when rebuilding the response", () => {
      const context = createContext({
        response: createResponse(),
        responseFormat: "html",
      });

      const result = applyContentTypeResponsePolicies(context);

      expect(result.headers.get("x-custom-header")).toBe("value");
    });

    it("preserves status and statusText when rebuilding the response", () => {
      const context = createContext({
        response: createResponse(),
        responseFormat: "html",
      });

      const result = applyContentTypeResponsePolicies(context);

      expect(result.status).toBe(201);
      expect(result.statusText).toBe("Created");
    });

    it("preserves the response body when rebuilding the response", async () => {
      const context = createContext({
        response: createResponse(),
        responseFormat: "html",
      });

      const result = applyContentTypeResponsePolicies(context);

      await expect(result.text()).resolves.toBe("hello");
    });

    it("returns a new response instance for managed formats", () => {
      const response = createResponse();

      const context = createContext({
        response,
        responseFormat: "html",
      });

      const result = applyContentTypeResponsePolicies(context);

      expect(result).not.toBe(response);
    });
  });

  describe("unmanaged content types", () => {
    it.each(["image", "binary"] as const)(
      "returns the original response for %s format",
      (responseFormat) => {
        const response = createResponse();

        const context = createContext({
          response,
          responseFormat,
        });

        const result = applyContentTypeResponsePolicies(context);

        expect(result).toBe(response);
      },
    );

    it.each(["image", "binary"] as const)(
      "does not overwrite an existing content-type header for %s format",
      (responseFormat) => {
        const response = new Response("hello", {
          status: 200,
          headers: {
            "content-type": "image/webp",
          },
        });

        const context = createContext({
          response,
          responseFormat,
        });

        const result = applyContentTypeResponsePolicies(context);

        expect(result.headers.get("content-type")).toBe("image/webp");
      },
    );
  });

  describe("header behaviour", () => {
    it("exposes content-type in a case-insensitive way", () => {
      const context = createContext({
        response: createResponse(),
        responseFormat: "json",
      });

      const result = applyContentTypeResponsePolicies(context);

      expect(result.headers.get("Content-Type")).toBe(
        "application/json; charset=utf-8",
      );
    });
  });
});
