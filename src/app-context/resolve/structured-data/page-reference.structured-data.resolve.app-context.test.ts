// src/app-context/resolve/structured-data/page-reference.structured-data.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";

import { resolveStructuredDataPageReferenceHref } from "@app-context/resolve/structured-data/page-reference.structured-data.resolve.app-context";

describe("resolveStructuredDataPageReferenceHref", () => {
  it("resolves a structured data page reference without a hash", () => {
    const appState = {
      siteConfig: {
        origin: "https://example.com",
      },
      getPublicPageById: jest.fn().mockReturnValue({
        slug: "/about",
      }),
    } as unknown as AppState;

    expect(
      resolveStructuredDataPageReferenceHref(appState, {
        pageId: "about",
      }),
    ).toBe("https://example.com/about");

    expect(appState.getPublicPageById).toHaveBeenCalledWith("about");
  });

  it("resolves a structured data page reference with a hash", () => {
    const appState = {
      siteConfig: {
        origin: "https://example.com",
      },
      getPublicPageById: jest.fn().mockReturnValue({
        slug: "/about",
      }),
    } as unknown as AppState;

    expect(
      resolveStructuredDataPageReferenceHref(appState, {
        pageId: "about",
        hash: "#person",
      }),
    ).toBe("https://example.com/about#person");

    expect(appState.getPublicPageById).toHaveBeenCalledWith("about");
  });

  it("throws when the referenced page cannot be found", () => {
    const appState = {
      siteConfig: {
        origin: "https://example.com",
      },
      getPublicPageById: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    expect(() =>
      resolveStructuredDataPageReferenceHref(appState, {
        pageId: "missing-page",
      }),
    ).toThrow(
      "Missing public page for structured data reference 'missing-page'.",
    );

    expect(appState.getPublicPageById).toHaveBeenCalledWith("missing-page");
  });
});
