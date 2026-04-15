// tests/src/request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request.test.ts

import { staticAssetResolver } from "@request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request";

describe("staticAssetResolver", () => {
  it("returns asset for a supported icon request", () => {
    const req = new Request("https://kevinellen.com/favicon.ico");

    const result = staticAssetResolver(req);

    expect(result.outcome).toBe("asset");

    if (result.outcome !== "asset") {
      throw new Error("Expected asset resolution.");
    }

    expect(result.asset.family).toBe("icon");
    expect(result.asset.contentType).toBe("image/x-icon");
  });

  it("returns asset for a supported font request", () => {
    const req = new Request(
      "https://kevinellen.com/assets/fonts/source-sans/sourcesans3-variablefont_wght.woff2",
    );

    const result = staticAssetResolver(req);

    expect(result.outcome).toBe("asset");

    if (result.outcome !== "asset") {
      throw new Error("Expected asset resolution.");
    }

    expect(result.asset.family).toBe("font");
    expect(result.asset.contentType).toBe("font/woff2");
  });

  it("returns asset for a supported image request", () => {
    const req = new Request(
      "https://kevinellen.com/assets/images/example.avif",
    );

    const result = staticAssetResolver(req);

    expect(result.outcome).toBe("asset");

    if (result.outcome !== "asset") {
      throw new Error("Expected asset resolution.");
    }

    expect(result.asset.family).toBe("image");
    expect(result.asset.contentType).toBe("image/avif");
  });

  it("returns unsupported-asset for a known asset prefix with an unsupported file type", () => {
    const req = new Request("https://kevinellen.com/assets/fonts/example.ttf");

    const result = staticAssetResolver(req);

    expect(result).toEqual({
      outcome: "unsupported-asset",
      pathname: "/assets/fonts/example.ttf",
    });
  });

  it("returns continue for a normal page request", () => {
    const req = new Request("https://kevinellen.com/journal/example");

    const result = staticAssetResolver(req);

    expect(result).toEqual({
      outcome: "continue",
    });
  });

  it("ignores query strings and resolves based on pathname", () => {
    const req = new Request(
      "https://kevinellen.com/favicon.ico?v=123&utm_source=test",
    );

    const result = staticAssetResolver(req);

    expect(result.outcome).toBe("asset");

    if (result.outcome !== "asset") {
      throw new Error("Expected asset resolution.");
    }

    expect(result.asset.requestPath).toBe("/favicon.ico");
  });
});
