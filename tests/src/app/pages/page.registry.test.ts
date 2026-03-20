// tests/src/app/pages/page.registry.test.ts

import {
  STATIC_PAGE_REGISTRY,
  ERROR_PAGE_REGISTRY,
} from "@app/pages/page.registry";
import type { PageDefinition } from "@app/pages/page.definition";

describe("page registry contract", () => {
  it("ensures all error pages conform to PageDefinition contract", () => {
    const errorPages = Object.values(ERROR_PAGE_REGISTRY);

    expect(errorPages.length).toBeGreaterThan(0);

    for (const page of errorPages) {
      assertValidPageDefinition(page);
    }
  });

  it("ensures error pages do not collide with static page slugs", () => {
    const staticSlugs = new Set(STATIC_PAGE_REGISTRY.map((p) => p.core.slug));

    for (const page of Object.values(ERROR_PAGE_REGISTRY)) {
      expect(staticSlugs.has(page.core.slug)).toBe(false);
    }
  });
});

function assertValidPageDefinition(page: PageDefinition): void {
  expect(page).toBeDefined();

  expect(page.core).toBeDefined();
  expect(typeof page.core.id).toBe("string");
  expect(typeof page.core.slug).toBe("string");
  expect(typeof page.core.kind).toBe("string");
  expect(typeof page.core.renderMode).toBe("string");

  expect(page.config).toBeDefined();
  expect(page.content).toBeDefined();
}
