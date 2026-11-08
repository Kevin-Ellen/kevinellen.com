// src/app/life-cycle/app-resolve/resolvers/registry/content/content.registry.resolver.app-resolve.test.ts

import { resolveContentRegistryAppResolve } from "./content.registry.resolver.app-resolve";

type Input = Parameters<typeof resolveContentRegistryAppResolve>[0];
type BundledContent = Input["appInit"]["content"]["bySlug"][string];
type ErrorContent = NonNullable<
  Input["appInit"]["content"]["errorsByStatus"][404]
>;
type PublishedContent = Input["ledger"]["bySlug"][string];

describe("Content registry AppResolve resolver", () => {
  const bundledPage = (id: string, label: string): BundledContent =>
    ({
      id,
      label,
    }) as BundledContent;

  const publishedPage = (id: string, label: string): PublishedContent =>
    ({
      id,
      label,
      photos: ["photo-001"],
      dateCreated: "2026-10-01",
      intro: "A journal introduction",
      title: "Journal title",
    }) as unknown as PublishedContent;

  const createInput = (
    bundled: Record<string, BundledContent> = {},
    published: Record<string, PublishedContent> = {},
    errors: Record<number, ErrorContent> = {},
  ): Input => ({
    appInit: {
      content: {
        bySlug: bundled,
        errorsByStatus: errors,
      },
    } as unknown as Input["appInit"],
    ledger: {
      bySlug: published,
    } as unknown as Input["ledger"],
  });

  it("returns empty registries when no content exists", () => {
    expect(resolveContentRegistryAppResolve(createInput())).toEqual({
      bySlug: {},
      errorsByStatus: {},
    });
  });

  it("maps bundled content into registry entries", () => {
    const input = createInput({
      "/": bundledPage("home", "Home"),
      "/about": bundledPage("about", "About"),
    });

    expect(resolveContentRegistryAppResolve(input).bySlug).toEqual({
      "/": {
        source: "bundled",
        id: "home",
        slug: "/",
        label: "Home",
      },
      "/about": {
        source: "bundled",
        id: "about",
        slug: "/about",
        label: "About",
      },
    });
  });

  it("maps published content and preserves its editorial fields", () => {
    const entry = publishedPage("journal-001", "Forest journal");

    const input = createInput({}, { "/journals/forest": entry });

    expect(
      resolveContentRegistryAppResolve(input).bySlug["/journals/forest"],
    ).toEqual({
      source: "published",
      id: entry.id,
      slug: "/journals/forest",
      label: entry.label,
      photos: entry.photos,
      dateCreated: entry.dateCreated,
      intro: entry.intro,
      title: entry.title,
    });
  });

  it("combines bundled and published content", () => {
    const input = createInput(
      { "/about": bundledPage("about", "About") },
      {
        "/journals/forest": publishedPage("journal-001", "Forest journal"),
      },
    );

    const result = resolveContentRegistryAppResolve(input);

    expect(result.bySlug["/about"]?.source).toBe("bundled");
    expect(result.bySlug["/journals/forest"]?.source).toBe("published");
    expect(Object.keys(result.bySlug)).toHaveLength(2);
  });

  it("rejects duplicate slugs across bundled and published content", () => {
    const input = createInput(
      { "/about": bundledPage("about", "About") },
      {
        "/about": publishedPage("published-about", "About"),
      },
    );

    expect(() => resolveContentRegistryAppResolve(input)).toThrow(
      "Duplicate content slug: /about",
    );
  });

  it("maps bundled error content by numeric status", () => {
    const errorPage = {
      ...bundledPage("not-found", "Not Found"),
      slug: "/404",
    } as ErrorContent;

    const input = createInput({}, {}, { 404: errorPage });

    expect(resolveContentRegistryAppResolve(input).errorsByStatus[404]).toEqual(
      {
        source: "bundled",
        id: "not-found",
        slug: "/404",
        label: "Not Found",
      },
    );
  });

  it("defaults missing error slugs to an empty string", () => {
    const errorPage = {
      ...bundledPage("not-found", "Not Found"),
      slug: null,
    } as ErrorContent;

    const input = createInput({}, {}, { 404: errorPage });

    expect(
      resolveContentRegistryAppResolve(input).errorsByStatus[404],
    ).toMatchObject({
      slug: "",
    });
  });

  it("keeps error content separate from the main registry", () => {
    const input = createInput(
      { "/": bundledPage("home", "Home") },
      {},
      {
        404: {
          ...bundledPage("not-found", "Not Found"),
          slug: "/404",
        },
      },
    );

    const result = resolveContentRegistryAppResolve(input);

    expect(Object.keys(result.bySlug)).toEqual(["/"]);
    expect(Object.keys(result.errorsByStatus)).toEqual(["404"]);
  });

  it("does not mutate the source registries", () => {
    const bundled = Object.freeze({
      "/": bundledPage("home", "Home"),
    });

    const published = Object.freeze({
      "/journals/forest": publishedPage("journal-001", "Forest journal"),
    });

    const input = createInput(bundled, published);

    const result = resolveContentRegistryAppResolve(input);

    expect(Object.keys(bundled)).toEqual(["/"]);
    expect(Object.keys(published)).toEqual(["/journals/forest"]);
    expect(result.bySlug).not.toBe(bundled);
    expect(result.bySlug).not.toBe(published);
  });
});
