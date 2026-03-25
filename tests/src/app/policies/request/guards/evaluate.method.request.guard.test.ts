// tests/src/app/policies/request/guards/evaluate.method.request.guard.test.ts

import { evaluateMethodRequestGuard } from "@app/policies/request/guards/evaluate.method.request.guard";

describe("evaluateMethodRequestGuard", () => {
  const createRequest = (method: string): Request =>
    new Request("https://example.com/test", { method });

  it("returns continue for GET", () => {
    const outcome = evaluateMethodRequestGuard(createRequest("GET"));

    expect(outcome).toEqual({ kind: "continue" });
  });

  it("returns continue for HEAD", () => {
    const outcome = evaluateMethodRequestGuard(createRequest("HEAD"));

    expect(outcome).toEqual({ kind: "continue" });
  });

  it("returns a direct response for POST", async () => {
    const outcome = evaluateMethodRequestGuard(createRequest("POST"));

    expect(outcome.kind).toBe("direct-response");

    if (outcome.kind !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    expect(outcome.response.status).toBe(405);
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("method");
    expect(outcome.response.headers.get("allow")).toBe("GET, HEAD");
    expect(await outcome.response.text()).toBe("");
  });

  it("returns a direct response for PUT", async () => {
    const outcome = evaluateMethodRequestGuard(createRequest("PUT"));

    expect(outcome.kind).toBe("direct-response");

    if (outcome.kind !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    expect(outcome.response.status).toBe(405);
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("method");
    expect(outcome.response.headers.get("allow")).toBe("GET, HEAD");
    expect(await outcome.response.text()).toBe("");
  });

  it("returns a direct response for PATCH", async () => {
    const outcome = evaluateMethodRequestGuard(createRequest("PATCH"));

    expect(outcome.kind).toBe("direct-response");

    if (outcome.kind !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    expect(outcome.response.status).toBe(405);
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("method");
    expect(outcome.response.headers.get("allow")).toBe("GET, HEAD");
    expect(await outcome.response.text()).toBe("");
  });

  it("returns a direct response for DELETE", async () => {
    const outcome = evaluateMethodRequestGuard(createRequest("DELETE"));

    expect(outcome.kind).toBe("direct-response");

    if (outcome.kind !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    expect(outcome.response.status).toBe(405);
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("method");
    expect(outcome.response.headers.get("allow")).toBe("GET, HEAD");
    expect(await outcome.response.text()).toBe("");
  });

  it("returns a direct response for OPTIONS", async () => {
    const outcome = evaluateMethodRequestGuard(createRequest("OPTIONS"));

    expect(outcome.kind).toBe("direct-response");

    if (outcome.kind !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    expect(outcome.response.status).toBe(405);
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("method");
    expect(outcome.response.headers.get("allow")).toBe("GET, HEAD");
    expect(await outcome.response.text()).toBe("");
  });
});
