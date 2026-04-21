// tests/src/request/pre-app-context/redirects/canonical/canonical.redirects.resolve.pre-app-context.request.test.ts

import { resolveCanonicalUrl } from "@request/pre-app-context/redirects/canonical/canonical.redirects.resolve.pre-app-context.request";

describe("resolveCanonicalUrl", () => {
  it("removes www and forces https in prod", () => {
    const inputUrl = new URL("http://www.kevinellen.com/about");

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "prod",
    } as Env);

    expect(result.href).toBe("https://kevinellen.com/about");
  });

  it("lowercases non-root pathnames in prod", () => {
    const inputUrl = new URL("https://kevinellen.com/About/Photography");

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "prod",
    } as Env);

    expect(result.pathname).toBe("/about/photography");
  });

  it("removes a trailing slash from non-root pathnames", () => {
    const inputUrl = new URL("https://kevinellen.com/about/");

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "prod",
    } as Env);

    expect(result.pathname).toBe("/about");
  });

  it("keeps the root pathname as /", () => {
    const inputUrl = new URL("https://kevinellen.com/");

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "prod",
    } as Env);

    expect(result.pathname).toBe("/");
    expect(result.href).toBe("https://kevinellen.com/");
  });

  it("preserves the query string", () => {
    const inputUrl = new URL(
      "http://www.kevinellen.com/About/?page=2&sort=desc",
    );

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "prod",
    } as Env);

    expect(result.href).toBe("https://kevinellen.com/about?page=2&sort=desc");
  });

  it("does not force https or strip www outside prod", () => {
    const inputUrl = new URL("http://www.kevinellen.com/About/");

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "dev",
    } as Env);

    expect(result.protocol).toBe("http:");
    expect(result.hostname).toBe("www.kevinellen.com");
    expect(result.pathname).toBe("/about");
  });

  it("preserves the port outside prod", () => {
    const inputUrl = new URL("http://localhost:8787/About/");

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "dev",
    } as Env);

    expect(result.href).toBe("http://localhost:8787/about");
  });

  it("does not mutate the original input URL", () => {
    const inputUrl = new URL("http://www.kevinellen.com/About/");

    const result = resolveCanonicalUrl(inputUrl, {
      APP_ENV: "prod",
    } as Env);

    expect(inputUrl.href).toBe("http://www.kevinellen.com/About/");
    expect(result.href).toBe("https://kevinellen.com/about");
  });
});
