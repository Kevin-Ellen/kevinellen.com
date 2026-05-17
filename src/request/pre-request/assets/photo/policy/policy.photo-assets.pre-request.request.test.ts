// src/request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request.test.ts

import { photoAssetResponsePolicy } from "@request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request";

const createEnv = (overrides: Partial<Env> = {}): Env =>
  ({
    APP_ENV: "dev",
    ...overrides,
  }) as Env;

describe("photoAssetResponsePolicy", () => {
  it("adds photo cache policy headers", async () => {
    const originalResponse = new Response("photo-body", {
      status: 200,
      headers: {
        "content-type": "image/webp",
      },
    });

    const response = photoAssetResponsePolicy(originalResponse, createEnv());

    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(response.headers.get("x-runtime-policy")).toBe("photo");
    expect(response.headers.get("content-type")).toBe("image/webp");

    await expect(response.text()).resolves.toBe("photo-body");
  });

  it("adds a noindex robots header outside prod", () => {
    const response = photoAssetResponsePolicy(
      new Response(null),
      createEnv({ APP_ENV: "dev" } as Partial<Env>),
    );

    expect(response.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  it("does not add a robots header in prod", () => {
    const response = photoAssetResponsePolicy(
      new Response(null),
      createEnv({ APP_ENV: "prod" } as Partial<Env>),
    );

    expect(response.headers.get("x-robots-tag")).toBeNull();
  });

  it("preserves status and status text", () => {
    const originalResponse = new Response(null, {
      status: 206,
      statusText: "Partial Content",
    });

    const response = photoAssetResponsePolicy(originalResponse, createEnv());

    expect(response.status).toBe(206);
    expect(response.statusText).toBe("Partial Content");
  });

  it("overrides existing cache-control header", () => {
    const originalResponse = new Response(null, {
      headers: {
        "cache-control": "no-store",
      },
    });

    const response = photoAssetResponsePolicy(originalResponse, createEnv());

    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
  });

  it("overrides existing runtime policy header", () => {
    const originalResponse = new Response(null, {
      headers: {
        "x-runtime-policy": "old-policy",
      },
    });

    const response = photoAssetResponsePolicy(originalResponse, createEnv());

    expect(response.headers.get("x-runtime-policy")).toBe("photo");
  });

  it("overrides existing robots header according to env policy", () => {
    const originalResponse = new Response(null, {
      headers: {
        "x-robots-tag": "index, follow",
      },
    });

    const response = photoAssetResponsePolicy(
      originalResponse,
      createEnv({ APP_ENV: "dev" } as Partial<Env>),
    );

    expect(response.headers.get("x-robots-tag")).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  it("removes existing robots header in prod", () => {
    const originalResponse = new Response(null, {
      headers: {
        "x-robots-tag": "noindex",
      },
    });

    const response = photoAssetResponsePolicy(
      originalResponse,
      createEnv({ APP_ENV: "prod" } as Partial<Env>),
    );

    expect(response.headers.get("x-robots-tag")).toBeNull();
  });

  it("does not mutate the original response headers", () => {
    const originalResponse = new Response(null, {
      headers: {
        "cache-control": "no-store",
        "x-runtime-policy": "old-policy",
        "x-robots-tag": "index, follow",
      },
    });

    photoAssetResponsePolicy(originalResponse, createEnv());

    expect(originalResponse.headers.get("cache-control")).toBe("no-store");
    expect(originalResponse.headers.get("x-runtime-policy")).toBe("old-policy");
    expect(originalResponse.headers.get("x-robots-tag")).toBe("index, follow");
  });

  it("adds photo asset security headers", () => {
    const response = photoAssetResponsePolicy(new Response(null), createEnv());

    expect(response.headers.get("content-security-policy")).toBe(
      [
        "default-src 'none'",
        "base-uri 'none'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'none'",
        "sandbox",
      ].join("; "),
    );

    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cross-origin-resource-policy")).toBe(
      "cross-origin",
    );
  });

  it("overrides upstream photo asset security headers", () => {
    const originalResponse = new Response(null, {
      headers: {
        "content-security-policy": "default-src *",
        "x-content-type-options": "sniff",
        "cross-origin-resource-policy": "same-origin",
      },
    });

    const response = photoAssetResponsePolicy(originalResponse, createEnv());

    expect(response.headers.get("content-security-policy")).toBe(
      [
        "default-src 'none'",
        "base-uri 'none'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'none'",
        "sandbox",
      ].join("; "),
    );

    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cross-origin-resource-policy")).toBe(
      "cross-origin",
    );
  });
});
