// tests/src/app/policies/request/resolution/evaluate.gone.request.resolution.test.ts

import { AppState } from "@app/appState/class.appState";
import { evaluateGonePathRequestResolution } from "@app/policies/request/resolution/evaluate.gone.request.resolution";

import { homePage } from "@app/pages/public/home.page";
import { error404Page } from "@app/pages/error/404.error.page";

import { createAppStateConfig } from "@tests/helpers/appState/create.config.appState";

describe("evaluateGonePathRequestResolution", () => {
  const createAppState = (gonePaths: readonly string[] = []): AppState => {
    const config = createAppStateConfig({
      publicPages: [homePage],
      errorPages: [error404Page],
      goneConfig: gonePaths.map((path) => ({ path })),
    });

    return new AppState(config);
  };

  it("returns continue when pathname is not in gone config", () => {
    const appState = createAppState(["/gone-page"]);

    const outcome = evaluateGonePathRequestResolution("/still-here", appState);

    expect(outcome).toEqual({ kind: "continue" });
  });

  it("returns render-error gone when pathname is in gone config", () => {
    const appState = createAppState(["/gone-page"]);

    const outcome = evaluateGonePathRequestResolution("/gone-page", appState);

    expect(outcome).toEqual({
      kind: "render-error",
      intent: "gone",
    });
  });

  it("matches exact pathnames only", () => {
    const appState = createAppState(["/gone-page"]);

    const outcome = evaluateGonePathRequestResolution(
      "/gone-page/child",
      appState,
    );

    expect(outcome).toEqual({ kind: "continue" });
  });

  it("returns continue when gone config is empty", () => {
    const appState = createAppState();

    const outcome = evaluateGonePathRequestResolution("/anything", appState);

    expect(outcome).toEqual({ kind: "continue" });
  });
});
