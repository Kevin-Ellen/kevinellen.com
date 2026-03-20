// tests/src/app/appState/appState.test.ts

import { AppState } from "@app/appState/appState";
import { createTestAppSeed } from "@app/bootstrap/appSeed.test.create";
import { error404page } from "@app/pages/error/error.404.page";

describe("AppState", () => {
  it("keeps its container structure immutable after construction", async () => {
    const appSeed = await createTestAppSeed();
    const appState = new AppState(appSeed);

    expect(Object.isFrozen(appState)).toBe(false);
    expect(Object.isFrozen(appState.appAssets)).toBe(true);
    expect(Object.isFrozen(appState.appAssets.scripts)).toBe(true);
    expect(Object.isFrozen(appState.appAssets.svgs)).toBe(true);
    expect(Object.isFrozen(appState.pages)).toBe(true);
    expect(Object.isFrozen(appState.pages.all)).toBe(true);
    expect(Object.isFrozen(appState.pages.errors)).toBe(true);

    expect(() => {
      (appState.appAssets.scripts as unknown as unknown[]).push({
        src: "/test.js",
        location: "body-end",
      });
    }).toThrow();

    expect(() => {
      (appState.appAssets.svgs as unknown as unknown[]).push({
        id: "test",
        markup: "<svg></svg>",
      });
    }).toThrow();

    expect(() => {
      (appState.pages.all as unknown as unknown[]).push(error404page);
    }).toThrow();

    expect(() => {
      (appState.pages.errors as Record<number, unknown>)[404] = null;
    }).toThrow();
  });

  it("returns the raw AppState shape via toJSON", async () => {
    const appSeed = await createTestAppSeed();
    const appState = new AppState(appSeed);

    expect(appState.toJSON()).toEqual({
      siteConfig: appState.siteConfig,
      appAssets: appState.appAssets,
      pages: {
        all: appState.pages.all,
        errors: appState.pages.errors,
      },
    });
  });

  it("returns the registered error page for a valid status", async () => {
    const appSeed = await createTestAppSeed();
    const appState = new AppState(appSeed);

    expect(appState.getErrorPageByStatus(404)).toBe(appSeed.pages.errors[404]);
    expect(appState.getErrorPageByStatus(500)).toBe(appSeed.pages.errors[500]);
  });

  it("throws when the 404 error page is missing", async () => {
    const appSeed = await createTestAppSeed();

    expect(() => {
      new AppState({
        ...appSeed,
        pages: {
          ...appSeed.pages,
          errors: {
            500: appSeed.pages.errors[500],
          } as never,
        },
      });
    }).toThrow(
      "Invariant violation: 404 error page is not registered in AppState.",
    );
  });

  it("throws when the 500 error page is missing", async () => {
    const appSeed = await createTestAppSeed();

    expect(() => {
      new AppState({
        ...appSeed,
        pages: {
          ...appSeed.pages,
          errors: {
            404: appSeed.pages.errors[404],
          } as never,
        },
      });
    }).toThrow(
      "Invariant violation: 500 error page is not registered in AppState.",
    );
  });
});
