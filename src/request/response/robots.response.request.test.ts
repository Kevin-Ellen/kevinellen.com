// src/request/response/robots.response.request.test.ts

import { resolveRobotsResponseHeader } from "@request/response/robots.response.request";

const createEnv = (APP_ENV: Env["APP_ENV"]): Env => ({ APP_ENV }) as Env;

describe("resolveRobotsResponseHeader", () => {
  it("returns null in prod when there are no robots directives", () => {
    expect(resolveRobotsResponseHeader([], createEnv("prod"))).toBeNull();
  });

  it("returns configured robots directives in prod", () => {
    expect(
      resolveRobotsResponseHeader(["noindex", "nofollow"], createEnv("prod")),
    ).toBe("noindex, nofollow");
  });

  it("adds lower-environment robots directives outside prod", () => {
    expect(resolveRobotsResponseHeader([], createEnv("dev"))).toBe(
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
  });

  it("deduplicates existing lower-environment robots directives", () => {
    expect(
      resolveRobotsResponseHeader(
        ["noindex", "nofollow", "noindex"],
        createEnv("stg"),
      ),
    ).toBe("noindex, nofollow, noarchive, nosnippet, noimageindex");
  });

  it("preserves custom directive order before lower-environment additions", () => {
    expect(resolveRobotsResponseHeader(["noarchive"], createEnv("dev"))).toBe(
      "noarchive, noindex, nofollow, nosnippet, noimageindex",
    );
  });
});
