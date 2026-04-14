// tests/src/request/guard/method/method.guard.pre-request.request.test.ts

import { evaluateMethodGuardPreRequest } from "@request/pre-request/guard/method/method.guard.pre-request.request";

describe("evaluateMethodGuardPreRequest", () => {
  it("returns null for GET requests", () => {
    const req = new Request("https://kevinellen.com/", {
      method: "GET",
    });

    const result = evaluateMethodGuardPreRequest(req);

    expect(result).toBeNull();
  });

  it("returns null for HEAD requests", () => {
    const req = new Request("https://kevinellen.com/", {
      method: "HEAD",
    });

    const result = evaluateMethodGuardPreRequest(req);

    expect(result).toBeNull();
  });

  it("returns 405 for unsupported methods", async () => {
    const req = new Request("https://kevinellen.com/", {
      method: "POST",
    });

    const result = evaluateMethodGuardPreRequest(req);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(405);
    await expect(result?.text()).resolves.toBe("");
  });

  it("sets the allow header for unsupported methods", () => {
    const req = new Request("https://kevinellen.com/", {
      method: "PUT",
    });

    const result = evaluateMethodGuardPreRequest(req);

    expect(result?.headers.get("allow")).toBe("GET, HEAD");
  });

  it("sets the runtime policy header for unsupported methods", () => {
    const req = new Request("https://kevinellen.com/", {
      method: "DELETE",
    });

    const result = evaluateMethodGuardPreRequest(req);

    expect(result?.headers.get("x-runtime-policy")).toBe("method");
  });
});
