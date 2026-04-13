// tests/src/app-state/resolve/pages/registries/error.static.registry.pages.app-state.test.ts

import { APP_STATE_PAGE_REGISTRY_STATIC_ERROR } from "@app-state/resolve/pages/registries/error.static.registry.pages.app-state";

import { authoredGoneErrorPage } from "@pages/error/static/authored.410.error.page";
import { authoredNotFoundErrorPage } from "@pages/error/static/authored.404.error.page";
import { authoredInternalErrorPage } from "@pages/error/static/authored.500.error.page";

describe("APP_STATE_PAGE_REGISTRY_STATIC_ERROR", () => {
  it("contains all expected static error pages in order", () => {
    expect(APP_STATE_PAGE_REGISTRY_STATIC_ERROR).toEqual([
      authoredGoneErrorPage,
      authoredNotFoundErrorPage,
      authoredInternalErrorPage,
    ]);
  });

  it("does not contain duplicate page ids", () => {
    const ids = APP_STATE_PAGE_REGISTRY_STATIC_ERROR.map((page) => page.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it("includes all required error statuses (404, 410, 500)", () => {
    const statuses = APP_STATE_PAGE_REGISTRY_STATIC_ERROR.map(
      (page) => page.status,
    );

    expect(statuses).toEqual(expect.arrayContaining([404, 410, 500]));
  });

  it("contains only the allowed error statuses", () => {
    const allowedStatuses = new Set([404, 410, 500]);

    for (const page of APP_STATE_PAGE_REGISTRY_STATIC_ERROR) {
      expect(allowedStatuses.has(page.status)).toBe(true);
    }
  });
});
