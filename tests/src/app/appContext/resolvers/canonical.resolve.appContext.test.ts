// tests/src/app/appContext/resolvers/canonical.resolve.appContext.test.ts

import { resolveCanonicalUrlAppContext } from "@app/appContext/resolvers/canonical.resolve.appContext";
import { createAppState } from "@app/appState/create.appState";

import type { DocumentRenderTarget } from "@app/request/request.document.types";

describe("resolveCanonicalUrlAppContext", () => {
  const appState = createAppState();

  it("resolves an absolute canonical url for a public page using the runtime canonical host", () => {
    const env = {
      APP_ENV: "prod",
      APP_HOST: "kevinellen.com",
    } as Env;

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("journal")!,
      status: 200,
    };

    const result = resolveCanonicalUrlAppContext(env, appState, target);

    expect(result).toBe("https://kevinellen.com/journal");
  });

  it("resolves the home page canonical url correctly", () => {
    const env = {
      APP_ENV: "prod",
      APP_HOST: "kevinellen.com",
    } as Env;

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("home")!,
      status: 200,
    };

    const result = resolveCanonicalUrlAppContext(env, appState, target);

    expect(result).toBe("https://kevinellen.com/");
  });

  it("falls back to the site config url when runtime canonical host is missing", () => {
    const env = {
      APP_ENV: "prod",
      APP_HOST: null,
    } as unknown as Env;

    const target: DocumentRenderTarget = {
      kind: "page",
      page: appState.getPublicPageById("journal")!,
      status: 200,
    };

    const result = resolveCanonicalUrlAppContext(env, appState, target);

    expect(result).toBe("https://kevinellen.com/journal");
  });

  it("returns null for an error-page target", () => {
    const env = {
      APP_ENV: "prod",
      APP_HOST: "kevinellen.com",
    } as Env;

    const target: DocumentRenderTarget = {
      kind: "error-page",
      page: appState.getErrorPageByStatus(404)!,
      status: 404,
    };

    const result = resolveCanonicalUrlAppContext(env, appState, target);

    expect(result).toBeNull();
  });
});
