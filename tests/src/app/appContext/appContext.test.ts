// tests/src/app/appContext/appContext.test.ts

import { AppContext } from "@app/appContext/appContext";

describe("AppContext", () => {
  const createEnv = (): Env =>
    ({
      APP_ENV: "dev",
    }) as Env;

  it("stores the seeded response kind", () => {
    const env = createEnv();

    const appContext = new AppContext({
      responseKind: "document",
      responseFormat: "json",
      env,
    });

    expect(appContext.getResponseKind()).toBe("document");
  });

  it("stores the seeded response format", () => {
    const env = createEnv();

    const appContext = new AppContext({
      responseKind: "direct",
      responseFormat: "text",
      env,
    });

    expect(appContext.getResponseFormat()).toBe("text");
  });

  it("stores the seeded env reference", () => {
    const env = createEnv();

    const appContext = new AppContext({
      responseKind: "direct",
      responseFormat: "text",
      env,
    });

    expect(appContext.getEnv()).toBe(env);
  });

  it("stores the seeded document reference", () => {
    const env = createEnv();
    const document = {
      nonce: "test-nonce",
      robots: "noindex, nofollow",
    };

    const appContext = new AppContext({
      responseKind: "document",
      responseFormat: "html",
      env,
      document,
    });

    expect(appContext.getDocument()).toBe(document);
  });

  it("defaults document to an empty object when omitted", () => {
    const env = createEnv();

    const appContext = new AppContext({
      responseKind: "direct",
      responseFormat: "text",
      env,
    });

    expect(appContext.getDocument()).toEqual({});
  });

  it("returns a serialisable debug shape from toJSON", () => {
    const env = createEnv();
    const document = {
      nonce: "test-nonce",
      robots: "noindex, nofollow",
    };

    const appContext = new AppContext({
      responseKind: "document",
      responseFormat: "html",
      env,
      document,
    });

    expect(appContext.toJSON()).toEqual({
      responseKind: "document",
      responseFormat: "html",
      document,
    });
  });

  it("does not expose env in toJSON", () => {
    const env = createEnv();

    const appContext = new AppContext({
      responseKind: "direct",
      responseFormat: "json",
      env,
    });

    expect(appContext.toJSON()).toEqual({
      responseKind: "direct",
      responseFormat: "json",
      document: {},
    });
  });
});
