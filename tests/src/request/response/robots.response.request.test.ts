// tests/src/request/response/robots.response.request.test.ts

import { resolveRobotsResponseHeader } from "@request/response/robots.response.request";

describe("resolveRobotsResponseHeader", () => {
  it("returns null in prod when no robots directives exist", () => {
    const result = resolveRobotsResponseHeader([], {
      APP_ENV: "prod",
    } as Env);

    expect(result).toBeNull();
  });

  it("returns existing robots directives in prod", () => {
    const result = resolveRobotsResponseHeader(["noindex", "nofollow"], {
      APP_ENV: "prod",
    } as Env);

    expect(result).toBe("noindex, nofollow");
  });

  it("adds non-prod safety directives when APP_ENV is not prod", () => {
    const result = resolveRobotsResponseHeader([], {
      APP_ENV: "dev",
    } as Env);

    expect(result).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  it("deduplicates existing robots directives with non-prod safety directives", () => {
    const result = resolveRobotsResponseHeader(["noindex", "nofollow"], {
      APP_ENV: "stg",
    } as Env);

    expect(result).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });
});
