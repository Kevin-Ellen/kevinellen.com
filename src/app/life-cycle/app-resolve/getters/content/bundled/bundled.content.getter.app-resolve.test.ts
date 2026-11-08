// src/app/life-cycle/app-resolve/getters/content/bundled/bundled.content.getter.app-resolve.test.ts

import type { AppInit } from "../../../../app-init/class.app-init";

import { getBundledContentAppResolve } from "./bundled.content.getter.app-resolve";

type Content = AppInit["content"];
type BySlug = Content["bySlug"];
type ErrorsByStatus = Content["errorsByStatus"];

describe("Bundled content getter AppResolve", () => {
  const page = {
    id: "home",
    kind: "public",
  } as BySlug[string];

  const errorPage = {
    id: "not-found",
    kind: "error",
    status: 404,
  } as NonNullable<ErrorsByStatus[404]>;

  const createAppInit = (
    bySlug: BySlug = { "/": page },
    errorsByStatus: ErrorsByStatus = { 404: errorPage },
  ): AppInit =>
    ({
      content: {
        bySlug,
        errorsByStatus,
      },
    }) as AppInit;

  it("returns bundled content matching the slug", () => {
    const appInit = createAppInit();

    const result = getBundledContentAppResolve({
      appInit,
      slug: "/",
    });

    expect(result).toBe(page);
  });

  it("returns the requested content when multiple slugs exist", () => {
    const journal = {
      id: "journal",
      kind: "public",
    } as BySlug[string];

    const appInit = createAppInit({
      "/": page,
      "/journals": journal,
    });

    expect(
      getBundledContentAppResolve({
        appInit,
        slug: "/journals",
      }),
    ).toBe(journal);
  });

  it("throws when the slug is not registered", () => {
    expect(() =>
      getBundledContentAppResolve({
        appInit: createAppInit(),
        slug: "/missing",
      }),
    ).toThrow("Bundled content not found: /missing");
  });

  it("does not silently resolve an empty slug", () => {
    expect(() =>
      getBundledContentAppResolve({
        appInit: createAppInit(),
        slug: "",
      }),
    ).toThrow("Bundled content not found: ");
  });

  it("returns bundled 404 content", () => {
    const result = getBundledContentAppResolve({
      appInit: createAppInit(),
      status: 404,
    });

    expect(result).toBe(errorPage);
  });

  it("throws when bundled 404 content is missing", () => {
    expect(() =>
      getBundledContentAppResolve({
        appInit: createAppInit({ "/": page }, {}),
        status: 404,
      }),
    ).toThrow("Bundled error content not found: 404");
  });

  it("does not modify the content registry", () => {
    const bySlug = Object.freeze({ "/": page });
    const errorsByStatus = Object.freeze({ 404: errorPage });
    const appInit = createAppInit(bySlug, errorsByStatus);

    getBundledContentAppResolve({ appInit, slug: "/" });
    getBundledContentAppResolve({ appInit, status: 404 });

    expect(appInit.content.bySlug).toBe(bySlug);
    expect(appInit.content.errorsByStatus).toBe(errorsByStatus);
  });
});
