// src/request/pre-app-context/redirects/canonical/canonical.redirects.resolve.pre-app-context.request.test.ts

import { resolveCanonicalUrl } from "@request/pre-app-context/redirects/canonical/canonical.redirects.resolve.pre-app-context.request";

const createEnv = (APP_ENV: Env["APP_ENV"]): Env => ({ APP_ENV }) as Env;

describe("resolveCanonicalUrl", () => {
  it("removes www in prod", () => {
    const result = resolveCanonicalUrl(
      new URL("https://www.example.com/about"),
      createEnv("prod"),
    );

    expect(result.href).toBe("https://example.com/about");
  });

  it("forces https in prod", () => {
    const result = resolveCanonicalUrl(
      new URL("http://example.com/about"),
      createEnv("prod"),
    );

    expect(result.href).toBe("https://example.com/about");
  });

  it("does not remove www or force https outside prod", () => {
    const result = resolveCanonicalUrl(
      new URL("http://www.example.com/about"),
      createEnv("dev"),
    );

    expect(result.href).toBe("http://www.example.com/about");
  });

  it("lowercases non-root pathnames", () => {
    const result = resolveCanonicalUrl(
      new URL("https://example.com/Journal/Entry-One"),
      createEnv("prod"),
    );

    expect(result.href).toBe("https://example.com/journal/entry-one");
  });

  it("removes trailing slash from non-root pathnames", () => {
    const result = resolveCanonicalUrl(
      new URL("https://example.com/journal/"),
      createEnv("prod"),
    );

    expect(result.href).toBe("https://example.com/journal");
  });

  it("preserves the root pathname", () => {
    const result = resolveCanonicalUrl(
      new URL("https://example.com/"),
      createEnv("prod"),
    );

    expect(result.href).toBe("https://example.com/");
  });

  it("preserves query params and hash", () => {
    const result = resolveCanonicalUrl(
      new URL("http://www.example.com/Journal/?a=1#section"),
      createEnv("prod"),
    );

    expect(result.href).toBe("https://example.com/journal?a=1#section");
  });

  it("does not mutate the input URL", () => {
    const input = new URL("http://www.example.com/Journal/");

    const result = resolveCanonicalUrl(input, createEnv("prod"));

    expect(result.href).toBe("https://example.com/journal");
    expect(input.href).toBe("http://www.example.com/Journal/");
  });
});
