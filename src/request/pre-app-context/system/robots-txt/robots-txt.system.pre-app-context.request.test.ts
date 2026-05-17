// src/request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request.test.ts

import { robotsTxtSystemOrchestrator } from "@request/pre-app-context/system/robots-txt/robots-txt.system.pre-app-context.request";

const createEnv = (): Env => ({ APP_ENV: "prod" }) as Env;

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = () =>
  ({
    siteConfig: {
      origin: "https://example.com",
    },
    publicPages: [],
  }) as never;

describe("robotsTxtSystemOrchestrator", () => {
  it("returns null when request is not for robots.txt", () => {
    const result = robotsTxtSystemOrchestrator(
      createRequest("/journal"),
      createEnv(),
      createAppState(),
    );

    expect(result).toBeNull();
  });

  it("returns rendered robots.txt response when request is for robots.txt", async () => {
    const result = robotsTxtSystemOrchestrator(
      createRequest("/robots.txt"),
      createEnv(),
      createAppState(),
    );

    expect(result).toMatchObject({ kind: "direct-response" });

    if (result?.kind !== "direct-response") {
      throw new Error("Expected direct-response result.");
    }

    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );

    await expect(result.response.text()).resolves.toBe(
      [
        "User-agent: *",
        "Allow: /",
        "Sitemap: https://example.com/sitemap.xml",
        "",
      ].join("\n"),
    );
  });
});
