// tests/src/app/request/route.document.request.test.ts

import { routeDocumentRequest } from "@app/request/route.document.request";
import { createAppState } from "@app/appState/create.appState";

describe("routeDocumentRequest", () => {
  const appState = createAppState();

  it("returns a page target when the pathname matches a public page", () => {
    const req = new Request("https://example.com/");

    const result = routeDocumentRequest(req, appState);

    expect(result.kind).toBe("page");

    if (result.kind !== "page") {
      throw new Error("Expected page target");
    }

    expect(result.status).toBe(200);
    expect(result.page.core.id).toBe("home");
    expect(result.page.core.slug).toBe("/");
  });

  it("returns a 404 error-page target when the pathname does not match a public page", () => {
    const req = new Request("https://example.com/does-not-exist");

    const result = routeDocumentRequest(req, appState);

    expect(result.kind).toBe("error-page");

    if (result.kind !== "error-page") {
      throw new Error("Expected error-page target");
    }

    expect(result.status).toBe(404);
    expect(result.page.core.status).toBe(404);
  });
});
