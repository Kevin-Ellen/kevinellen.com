// tests/src/app/policies/request/resolution/evaluate.canonical.request.resolution.test.ts

import { evaluateCanonicalRequestResolution } from "@app/policies/request/resolution/evaluate.canonical.request.resolution";

import type { RuntimeBehaviour } from "@app/runtime/get.runtime.behaviour";

describe("evaluateCanonicalRequestResolution", () => {
  const createRuntimeBehaviour = (
    overrides: Partial<RuntimeBehaviour> = {},
  ): RuntimeBehaviour => ({
    appEnv: "prod",
    canonical: true,
    indexing: true,
    public: true,
    canonicalHost: "kevinellen.com",
    ...overrides,
  });

  it("returns unchanged result when url is already canonical", () => {
    const inputUrl = new URL("https://kevinellen.com/about");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(false);
    expect(result.url.toString()).toBe("https://kevinellen.com/about");
  });

  it("canonicalises hostname when canonical host enforcement is enabled", () => {
    const inputUrl = new URL("https://www.kevinellen.com/about");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(true);
    expect(result.url.toString()).toBe("https://kevinellen.com/about");
  });

  it("does not canonicalise hostname when canonical host enforcement is disabled", () => {
    const inputUrl = new URL("https://stg.kevinellen.com/about");
    const runtime = createRuntimeBehaviour({
      appEnv: "dev",
      canonical: false,
      indexing: false,
      public: false,
      canonicalHost: null,
    });

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(false);
    expect(result.url.toString()).toBe("https://stg.kevinellen.com/about");
  });

  it("lowercases pathname", () => {
    const inputUrl = new URL("https://kevinellen.com/About");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(true);
    expect(result.url.toString()).toBe("https://kevinellen.com/about");
  });

  it("removes trailing slash from non-root pathname", () => {
    const inputUrl = new URL("https://kevinellen.com/about/");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(true);
    expect(result.url.toString()).toBe("https://kevinellen.com/about");
  });

  it("applies hostname, lowercase and trailing slash canonicalisation together", () => {
    const inputUrl = new URL("https://www.kevinellen.com/About/");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(true);
    expect(result.url.toString()).toBe("https://kevinellen.com/about");
  });

  it("preserves the root pathname", () => {
    const inputUrl = new URL("https://kevinellen.com/");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(false);
    expect(result.url.toString()).toBe("https://kevinellen.com/");
  });

  it("preserves query strings while canonicalising", () => {
    const inputUrl = new URL("https://www.kevinellen.com/About/?q=duck");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(true);
    expect(result.url.toString()).toBe("https://kevinellen.com/about?q=duck");
  });

  it("preserves the port when canonicalising the hostname", () => {
    const inputUrl = new URL("https://www.kevinellen.com:8443/about");
    const runtime = createRuntimeBehaviour();

    const result = evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(result.changed).toBe(true);
    expect(result.url.toString()).toBe("https://kevinellen.com:8443/about");
  });

  it("does not mutate the input url instance", () => {
    const inputUrl = new URL("https://www.kevinellen.com/About/");
    const runtime = createRuntimeBehaviour();

    evaluateCanonicalRequestResolution(inputUrl, runtime);

    expect(inputUrl.toString()).toBe("https://www.kevinellen.com/About/");
  });
});
