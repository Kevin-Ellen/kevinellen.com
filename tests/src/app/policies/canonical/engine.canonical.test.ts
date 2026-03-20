// tests/src/app/policies/canonical/engine.canonical.test.ts

import { evaluateCanonicalPolicy } from "@app/policies/canonical/engine.canonical";

describe("evaluateCanonicalPolicy", () => {
  const createRequest = (url: string): Request => new Request(url);

  const expectDirectCanonicalRedirect = (
    outcome: ReturnType<typeof evaluateCanonicalPolicy>,
    expectedLocation: string,
  ): void => {
    expect(outcome.type).toBe("direct-response");

    if (outcome.type !== "direct-response") {
      throw new Error(
        'Test setup failed: expected canonical policy to return "direct-response".',
      );
    }

    expect(outcome.response.status).toBe(308);
    expect(outcome.response.headers.get("location")).toBe(expectedLocation);
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("canonical");
    expect(outcome.response.headers.get("content-type")).toBeNull();
  };

  it("returns continue when the request URL is already canonical in prod", () => {
    const request = createRequest("https://example.com/about");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("returns continue when the root URL is already canonical in prod", () => {
    const request = createRequest("https://example.com/");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("strips www from the hostname in prod", () => {
    const request = createRequest("https://www.example.com/about");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expectDirectCanonicalRedirect(outcome, "https://example.com/about");
  });

  it("does not strip www from the hostname outside prod", () => {
    const request = createRequest("https://www.example.com/about");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "dev",
    } as Env);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("removes a trailing slash from non-root paths", () => {
    const request = createRequest("https://example.com/about/");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expectDirectCanonicalRedirect(outcome, "https://example.com/about");
  });

  it("does not alter the root path when it is /", () => {
    const request = createRequest("https://example.com/");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("lowercases the pathname", () => {
    const request = createRequest("https://example.com/About");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expectDirectCanonicalRedirect(outcome, "https://example.com/about");
  });

  it("preserves the query string during canonical redirect", () => {
    const request = createRequest("https://example.com/About/?ref=mail&x=1");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expectDirectCanonicalRedirect(
      outcome,
      "https://example.com/about?ref=mail&x=1",
    );
  });

  it("combines host, trailing slash, and lowercase canonicalisation into a single redirect", () => {
    const request = createRequest("https://www.example.com/About/?ref=mail");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "prod",
    } as Env);

    expectDirectCanonicalRedirect(
      outcome,
      "https://example.com/about?ref=mail",
    );
  });

  it("returns continue for an already canonical non-prod mixed hostname when no path changes are needed", () => {
    const request = createRequest("https://www.example.com/about");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "stg",
    } as Env);

    expect(outcome).toEqual({ type: "continue" });
  });

  it("still applies path canonicalisation outside prod", () => {
    const request = createRequest("https://www.example.com/About/");
    const outcome = evaluateCanonicalPolicy(request, {
      APP_ENV: "dev",
    } as Env);

    expectDirectCanonicalRedirect(outcome, "https://www.example.com/about");
  });
});
