// src/request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request.test.ts

import { photoAssetResponsePolicy } from "@request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request";

describe("photoAssetResponsePolicy", () => {
  it("adds photo cache policy headers", async () => {
    const originalResponse = new Response("photo-body", {
      status: 200,
      headers: {
        "content-type": "image/webp",
      },
    });

    const response = photoAssetResponsePolicy(originalResponse);

    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );

    expect(response.headers.get("x-runtime-policy")).toBe("photo");

    expect(response.headers.get("content-type")).toBe("image/webp");

    await expect(response.text()).resolves.toBe("photo-body");
  });

  it("preserves status and status text", () => {
    const originalResponse = new Response(null, {
      status: 206,
      statusText: "Partial Content",
    });

    const response = photoAssetResponsePolicy(originalResponse);

    expect(response.status).toBe(206);
    expect(response.statusText).toBe("Partial Content");
  });

  it("overrides existing cache-control header", () => {
    const originalResponse = new Response(null, {
      headers: {
        "cache-control": "no-store",
      },
    });

    const response = photoAssetResponsePolicy(originalResponse);

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

    const response = photoAssetResponsePolicy(originalResponse);

    expect(response.headers.get("x-runtime-policy")).toBe("photo");
  });

  it("does not mutate the original response headers", () => {
    const originalResponse = new Response(null, {
      headers: {
        "cache-control": "no-store",
      },
    });

    photoAssetResponsePolicy(originalResponse);

    expect(originalResponse.headers.get("cache-control")).toBe("no-store");
  });
});
