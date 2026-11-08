// src/app/life-cycle/app-resolve/resolvers/structured-data/derived/breadcrumbs/breadcrumbs.derived.structured-data.resolver.app-resolve.test.ts

import { resolveBreadcrumbsDerivedStructuredDataAppResolve } from "./breadcrumbs.derived.structured-data.resolver.app-resolve";

type Input = Parameters<
  typeof resolveBreadcrumbsDerivedStructuredDataAppResolve
>[0];

type Breadcrumbs = Input["breadcrumbs"];
type Breadcrumb = Breadcrumbs[number];

describe("Breadcrumbs derived structured data AppResolve", () => {
  const canonicalDomain = "https://kevinellen.com";

  const createBreadcrumb = (href: string, label?: string): Breadcrumb =>
    ({
      href,
      label,
    }) as unknown as Breadcrumb;

  const createBreadcrumbs = (): Breadcrumbs => [
    createBreadcrumb("/", "Home"),
    createBreadcrumb("/journals", "Journals"),
    createBreadcrumb("/journals/epping-forest", "Epping Forest"),
  ];

  const resolve = (
    breadcrumbs: Breadcrumbs = createBreadcrumbs(),
    domain = canonicalDomain,
  ) =>
    resolveBreadcrumbsDerivedStructuredDataAppResolve({
      breadcrumbs,
      canonicalDomain: domain,
    });

  it("creates a BreadcrumbList entity", () => {
    expect(resolve()).toMatchObject({
      "@type": "BreadcrumbList",
    });
  });

  it("assigns sequential one-based positions", () => {
    expect(resolve()).toMatchObject({
      itemListElement: [{ position: 1 }, { position: 2 }, { position: 3 }],
    });
  });

  it("maps labels and resolves relative URLs", () => {
    expect(resolve()).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kevinellen.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Journals",
          item: "https://kevinellen.com/journals",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Epping Forest",
          item: "https://kevinellen.com/journals/epping-forest",
        },
      ],
    });
  });

  it("defaults missing labels to an empty string", () => {
    expect(resolve([createBreadcrumb("/journals")])).toMatchObject({
      itemListElement: [
        {
          name: "",
          item: "https://kevinellen.com/journals",
        },
      ],
    });
  });

  it("preserves an explicitly empty label", () => {
    expect(resolve([createBreadcrumb("/", "")])).toMatchObject({
      itemListElement: [{ name: "" }],
    });
  });

  it("preserves absolute URLs", () => {
    expect(
      resolve([createBreadcrumb("https://example.com/page", "External")]),
    ).toMatchObject({
      itemListElement: [{ item: "https://example.com/page" }],
    });
  });

  it("resolves URLs against the supplied domain", () => {
    expect(
      resolve(
        [createBreadcrumb("/", "Home")],
        "https://staging.kevinellen.com",
      ),
    ).toMatchObject({
      itemListElement: [{ item: "https://staging.kevinellen.com/" }],
    });
  });

  it("preserves query strings and fragments", () => {
    expect(
      resolve([createBreadcrumb("/journals/entry?view=all#photos", "Entry")]),
    ).toMatchObject({
      itemListElement: [
        {
          item: "https://kevinellen.com/journals/entry?view=all#photos",
        },
      ],
    });
  });

  it("supports an empty breadcrumb collection", () => {
    expect(resolve([])).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [],
    });
  });

  it("does not mutate the authored breadcrumbs", () => {
    const breadcrumbs = Object.freeze(createBreadcrumbs());

    const result = resolve(breadcrumbs);

    expect(breadcrumbs[0]?.href).toBe("/");
    expect(result).toHaveProperty("itemListElement");
  });

  it("propagates invalid URL errors", () => {
    expect(() =>
      resolve([createBreadcrumb("/", "Home")], "invalid-domain"),
    ).toThrow("Invalid URL");
  });
});
