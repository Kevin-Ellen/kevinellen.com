// tests/src/app/request/router.request.test.ts

import { AppState } from "@app/appState/appState";
import { createTestAppSeed } from "@app/bootstrap/appSeed.test.create";
import { routeRequest } from "@app/request/router.request";

describe("routeRequest", () => {
  let appState: AppState;

  beforeEach(async () => {
    const appSeed = await createTestAppSeed();
    appState = new AppState(appSeed);
  });

  it("returns found with the resolved page when the slug exists", () => {
    const expectedPage = appState.getPageBySlug("/");

    if (!expectedPage) {
      throw new Error('Test setup failed: expected home page at "/" to exist.');
    }

    const result = routeRequest("/", appState);

    expect(result).toEqual({
      kind: "found",
      page: expectedPage,
    });
  });

  it("returns not-found when the slug does not exist", () => {
    const result = routeRequest("/does-not-exist", appState);

    expect(result).toEqual({
      kind: "not-found",
    });
  });
});
