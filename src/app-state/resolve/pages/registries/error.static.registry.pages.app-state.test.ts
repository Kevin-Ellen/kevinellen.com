// src/app-state/resolve/pages/registries/error.static.registry.pages.app-state.test.ts

import { APP_STATE_PAGE_REGISTRY_STATIC_ERROR } from "@app-state/resolve/pages/registries/error.static.registry.pages.app-state";

import { authoredGoneErrorPage } from "@pages/error/static/authored.410.error.page";
import { authoredNotFoundErrorPage } from "@pages/error/static/authored.404.error.page";
import { authoredInternalErrorPage } from "@pages/error/static/authored.500.error.page";

describe("APP_STATE_PAGE_REGISTRY_STATIC_ERROR", () => {
  it("contains the static authored error pages", () => {
    expect(APP_STATE_PAGE_REGISTRY_STATIC_ERROR).toEqual([
      authoredGoneErrorPage,
      authoredNotFoundErrorPage,
      authoredInternalErrorPage,
    ]);
  });

  it("uses unique error page ids", () => {
    const ids = APP_STATE_PAGE_REGISTRY_STATIC_ERROR.map((page) => page.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
