// src/app/life-cycle/app-resolve/resolvers/primitives/link/link.primitive.resolver.app-resolve.test.ts

import { resolveLinkAppResolve } from "./link.primitive.resolver.app-resolve";

type Input = Parameters<typeof resolveLinkAppResolve>[0];
type Link = Input["link"];
type Registry = Input["registry"];
type RegistryEntry = Registry["bySlug"][string];

describe("Link primitive AppResolve resolver", () => {
  const createEntry = (
    id: string,
    slug: string,
    label: string,
  ): RegistryEntry => ({
    source: "bundled",
    id,
    slug,
    label,
  });

  const createRegistry = (): Registry => ({
    bySlug: {
      "/": createEntry("home", "/", "Home"),
      "/about": createEntry("about", "/about", "About"),
      "/journals": createEntry("journals", "/journals", "Journals"),
    },
    errorsByStatus: {},
  });

  const createInternal = (
    pageId: string,
    overrides: Record<string, unknown> = {},
  ): Link =>
    ({
      kind: "internal",
      pageId,
      label: undefined,
      ...overrides,
    }) as unknown as Link;

  const createExternal = (overrides: Record<string, unknown> = {}): Link =>
    ({
      kind: "external",
      href: "https://example.com",
      label: "External website",
      target: "_self",
      rel: ["nofollow"],
      ...overrides,
    }) as unknown as Link;

  const resolve = (link: Link, registry = createRegistry()) =>
    resolveLinkAppResolve({ link, registry });

  describe("Internal links", () => {
    it("resolves page IDs using the content registry", () => {
      expect(resolve(createInternal("about"))).toMatchObject({
        href: "/about",
        label: "About",
      });
    });

    it("uses the canonical slug from the registry", () => {
      expect(resolve(createInternal("journals"))).toMatchObject({
        href: "/journals",
      });
    });

    it("preserves an explicitly authored label", () => {
      expect(
        resolve(createInternal("about", { label: "Who I Am" })),
      ).toMatchObject({
        href: "/about",
        label: "Who I Am",
      });
    });

    it("uses the registry label when the link label is absent", () => {
      expect(
        resolve(createInternal("about", { label: undefined })),
      ).toMatchObject({
        label: "About",
      });
    });

    it("preserves an empty authored label", () => {
      expect(resolve(createInternal("about", { label: "" }))).toMatchObject({
        label: "",
      });
    });

    it("removes internal routing properties from the result", () => {
      const result = resolve(createInternal("home"));

      expect(result).not.toHaveProperty("kind");
      expect(result).not.toHaveProperty("pageId");
    });

    it("preserves other link properties", () => {
      expect(
        resolve(
          createInternal("about", {
            title: "Read more about the photographer",
            ariaLabel: "About the photographer",
          }),
        ),
      ).toMatchObject({
        title: "Read more about the photographer",
        ariaLabel: "About the photographer",
      });
    });

    it("resolves published content entries", () => {
      const registry = createRegistry();

      const published = createEntry(
        "entry-001",
        "/journals/forest",
        "Forest Journal",
      );

      const withPublished = {
        ...registry,
        bySlug: {
          ...registry.bySlug,
          "/journals/forest": {
            ...published,
            source: "published",
          },
        },
      } as Registry;

      expect(resolve(createInternal("entry-001"), withPublished)).toMatchObject(
        {
          href: "/journals/forest",
          label: "Forest Journal",
        },
      );
    });

    it("throws when the page ID is unknown", () => {
      expect(() => resolve(createInternal("missing"))).toThrow(
        "Unable to resolve internal link: missing",
      );
    });

    it("throws when the registry is empty", () => {
      const registry = {
        bySlug: {},
        errorsByStatus: {},
      } as Registry;

      expect(() => resolve(createInternal("home"), registry)).toThrow(
        "Unable to resolve internal link: home",
      );
    });

    it("does not modify the original link", () => {
      const link = Object.freeze(
        createInternal("about", {
          label: "About",
        }),
      );

      const result = resolve(link);

      expect(link).toHaveProperty("kind", "internal");
      expect(link).toHaveProperty("pageId", "about");
      expect(result).not.toBe(link);
    });
  });

  describe("External links", () => {
    it("preserves the external URL", () => {
      expect(resolve(createExternal())).toMatchObject({
        href: "https://example.com",
        label: "External website",
      });
    });

    it("forces external links to open in a new tab", () => {
      expect(resolve(createExternal({ target: "_self" }))).toMatchObject({
        target: "_blank",
      });
    });

    it("replaces authored rel values with noopener", () => {
      expect(resolve(createExternal({ rel: ["nofollow"] }))).toMatchObject({
        rel: ["noopener"],
      });
    });

    it("adds target and rel when not supplied", () => {
      const result = resolve(
        createExternal({
          target: undefined,
          rel: undefined,
        }),
      );

      expect(result).toMatchObject({
        target: "_blank",
        rel: ["noopener"],
      });
    });

    it("removes the kind discriminator", () => {
      expect(resolve(createExternal())).not.toHaveProperty("kind");
    });

    it("preserves other external link properties", () => {
      expect(
        resolve(
          createExternal({
            title: "Visit another website",
            ariaLabel: "External website",
          }),
        ),
      ).toMatchObject({
        title: "Visit another website",
        ariaLabel: "External website",
      });
    });

    it("does not require a registry entry", () => {
      const registry = {
        bySlug: {},
        errorsByStatus: {},
      } as Registry;

      expect(resolve(createExternal(), registry)).toMatchObject({
        href: "https://example.com",
      });
    });

    it("does not mutate the external link", () => {
      const link = Object.freeze(createExternal());

      const result = resolve(link);

      expect(link).toHaveProperty("target", "_self");
      expect(link).toHaveProperty("rel", ["nofollow"]);
      expect(result).not.toBe(link);
    });
  });
});
