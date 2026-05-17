// src/request/response/cache.response.request.test.ts

import { resolveHtmlCacheControlHeader } from "@request/response/cache.response.request";

describe("resolveHtmlCacheControlHeader", () => {
  it("returns no-store outside prod", () => {
    expect(resolveHtmlCacheControlHeader({ APP_ENV: "dev" } as Env, 200)).toBe(
      "no-store",
    );

    expect(resolveHtmlCacheControlHeader({ APP_ENV: "stg" } as Env, 200)).toBe(
      "no-store",
    );
  });

  it("returns must-revalidate for successful prod HTML responses", () => {
    expect(resolveHtmlCacheControlHeader({ APP_ENV: "prod" } as Env, 200)).toBe(
      "public, max-age=0, must-revalidate",
    );
  });

  it("returns no-store for prod error responses", () => {
    expect(resolveHtmlCacheControlHeader({ APP_ENV: "prod" } as Env, 404)).toBe(
      "no-store",
    );

    expect(resolveHtmlCacheControlHeader({ APP_ENV: "prod" } as Env, 500)).toBe(
      "no-store",
    );
  });
});
