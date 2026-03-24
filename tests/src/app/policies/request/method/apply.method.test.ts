// tests/src/app/policies/request/method/apply.method.test.ts

import { applyMethodPolicy } from "@app/policies/request/method/apply.method";

describe("applyMethodPolicy", () => {
  const createRequest = (method: string): Request =>
    new Request("https://kevinellen.com/example", { method });

  const expectDirectResponse = (
    result: ReturnType<typeof applyMethodPolicy>,
  ): Response => {
    if (result.type !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    return result.response;
  };

  describe("allowed methods", () => {
    it.each(["GET", "HEAD"])(
      "returns continue for allowed method %s",
      (method) => {
        const req = createRequest(method);

        const result = applyMethodPolicy(req);

        expect(result).toEqual({ type: "continue" });
      },
    );
  });

  describe("disallowed methods", () => {
    it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"])(
      "returns 405 direct-response for disallowed method %s",
      (method) => {
        const req = createRequest(method);

        const result = applyMethodPolicy(req);
        const response = expectDirectResponse(result);

        expect(response.status).toBe(405);
        expect(response.headers.get("allow")).toBe("GET, HEAD");
        expect(response.headers.get("x-runtime-policy")).toBe("method");
      },
    );
  });

  describe("response contract", () => {
    it("sets only the expected method policy headers", () => {
      const req = createRequest("POST");

      const result = applyMethodPolicy(req);
      const response = expectDirectResponse(result);

      expect(Object.fromEntries(response.headers.entries())).toEqual({
        allow: "GET, HEAD",
        "x-runtime-policy": "method",
      });
    });

    it("returns an empty response body for rejected methods", async () => {
      const req = createRequest("POST");

      const result = applyMethodPolicy(req);
      const response = expectDirectResponse(result);

      await expect(response.text()).resolves.toBe("");
    });

    it("does not set a content-type header", () => {
      const req = createRequest("POST");

      const result = applyMethodPolicy(req);
      const response = expectDirectResponse(result);

      expect(response.headers.get("content-type")).toBeNull();
    });

    it("exposes method policy headers in a case-insensitive way", () => {
      const req = createRequest("POST");

      const result = applyMethodPolicy(req);
      const response = expectDirectResponse(result);

      expect(response.headers.get("Allow")).toBe("GET, HEAD");
      expect(response.headers.get("X-Runtime-Policy")).toBe("method");
    });
  });
});
