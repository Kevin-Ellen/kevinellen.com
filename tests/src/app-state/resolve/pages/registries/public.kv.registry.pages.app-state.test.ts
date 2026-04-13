// tests/src/app-state/resolve/pages/registries/public.kv.registry.pages.app-state.test.ts

import { APP_STATE_PAGE_REGISTRY_KV_PUBLIC } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";

describe("APP_STATE_PAGE_REGISTRY_KV_PUBLIC", () => {
  it("is currently empty (no KV-backed public pages implemented yet)", () => {
    expect(APP_STATE_PAGE_REGISTRY_KV_PUBLIC).toEqual([]);
  });
});
