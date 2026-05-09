// src/request/pre-request/guard/method/method.guard.pre-request.request.test.ts

import { evaluateMethodGuardPreRequest } from "@request/pre-request/guard/method/method.guard.pre-request.request";

describe("evaluateMethodGuardPreRequest", () => {
  it.each(["GET", "HEAD"] as const)("allows %s requests", (method) => {
    const result = evaluateMethodGuardPreRequest(
      new Request("https://example.com/", { method }),
    );

    expect(result).toBeNull();
  });

  it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const)(
    "rejects %s requests",
    (method) => {
      const result = evaluateMethodGuardPreRequest(
        new Request("https://example.com/", { method }),
      );

      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(405);
      expect(result?.headers.get("allow")).toBe("GET, HEAD");
      expect(result?.headers.get("x-runtime-policy")).toBe("method");
    },
  );
});
