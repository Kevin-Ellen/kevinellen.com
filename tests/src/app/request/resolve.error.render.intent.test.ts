// tests/src/app/request/resolve.error.render.intent.test.ts

import { resolveErrorRenderIntent } from "@app/request/resolve.error.render.intent";
import { createAppState } from "@app/appState/create.appState";

describe("resolveErrorRenderIntent", () => {
  const appState = createAppState();

  it("returns a 410 error-page target for gone intent", () => {
    const result = resolveErrorRenderIntent("gone", appState);

    expect(result.kind).toBe("error-page");

    if (result.kind !== "error-page") {
      throw new Error("Expected error-page target");
    }

    expect(result.status).toBe(410);
    expect(result.page.core.status).toBe(410);
  });
});
