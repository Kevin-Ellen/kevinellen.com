// tests/src/request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request.test.ts

import { photoAssetResponsePolicy } from "@request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request";

describe("photoAssetResponsePolicy", () => {
  it("sets cache-control and runtime policy headers", async () => {
    const response = new Response("photo-body", {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "image/jpeg",
        etag: '"photo123"',
      },
    });

    const result = photoAssetResponsePolicy(response);

    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");

    expect(result.headers.get("content-type")).toBe("image/jpeg");
    expect(result.headers.get("etag")).toBe('"photo123"');
    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(result.headers.get("x-runtime-policy")).toBe("photo");

    await expect(result.text()).resolves.toBe("photo-body");
  });

  it("overrides any existing cache-control header", () => {
    const response = new Response(null, {
      status: 200,
      headers: {
        "cache-control": "no-store",
      },
    });

    const result = photoAssetResponsePolicy(response);

    expect(result.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(result.headers.get("x-runtime-policy")).toBe("photo");
  });
});
