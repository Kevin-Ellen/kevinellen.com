// tests/src/app/policies/method/engine.method.test.ts

import { evaluateMethodPolicy } from "@app/policies/request/method/engine.method";

describe("evaluateMethodPolicy", () => {
  const createRequest = (method: string): Request =>
    new Request("https://example.com/", { method });

  it("returns continue for GET", () => {
    const outcome = evaluateMethodPolicy(createRequest("GET"));
    expect(outcome).toEqual({ type: "continue" });
  });

  it("returns continue for HEAD", () => {
    const outcome = evaluateMethodPolicy(createRequest("HEAD"));
    expect(outcome).toEqual({ type: "continue" });
  });

  it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const)(
    "returns 405 direct response for %s",
    (method) => {
      const outcome = evaluateMethodPolicy(createRequest(method));

      expect(outcome.type).toBe("direct-response");

      if (outcome.type !== "direct-response") {
        throw new Error(
          'Test setup failed: expected method policy to return "direct-response".',
        );
      }

      expect(outcome.response.status).toBe(405);
      expect(outcome.response.headers.get("allow")).toBe("GET, HEAD");
      expect(outcome.response.headers.get("x-runtime-policy")).toBe("method");
      expect(outcome.response.headers.get("content-type")).toBeNull();
    },
  );
});
