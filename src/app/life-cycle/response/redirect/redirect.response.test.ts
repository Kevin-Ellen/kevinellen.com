// src/app/life-cycle/response/redirect/redirect.response.test.ts

import type { RedirectResponseOutput } from "../../../types/response/response.shared.type";

import { handleRedirectResponse } from "./redirect.response";

describe("Redirect response", () => {
  const createDocument = (
    overrides: Partial<RedirectResponseOutput> = {},
  ): RedirectResponseOutput => ({
    kind: "redirect",
    status: 301,
    location: "https://kevinellen.com/journal",
    ...overrides,
  });

  it("returns a permanent redirect", () => {
    const response = handleRedirectResponse({
      document: createDocument(),
    });

    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe(
      "https://kevinellen.com/journal",
    );
  });

  it.each([301, 302, 307, 308] as const)(
    "preserves redirect status %i",
    (status) => {
      const response = handleRedirectResponse({
        document: createDocument({ status }),
      });

      expect(response.status).toBe(status);
      expect(response.redirected).toBe(false);
    },
  );

  it("preserves destination query parameters", () => {
    const location = "https://kevinellen.com/journal?topic=wildlife&page=2";

    const response = handleRedirectResponse({
      document: createDocument({ location }),
    });

    expect(response.headers.get("Location")).toBe(location);
  });

  it("returns a response without a body", async () => {
    const response = handleRedirectResponse({
      document: createDocument(),
    });

    expect(response.body).toBeNull();
    expect(await response.text()).toBe("");
  });
});
