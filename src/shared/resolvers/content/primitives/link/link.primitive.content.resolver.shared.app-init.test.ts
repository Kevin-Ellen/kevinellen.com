// src/shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init.test.ts

import type { LinkAuthored } from "../../../../../content-schema/primitives/link.primitive.content-schema.authored.type";

import { resolveSvgReferenceAppInit } from "../svg/svg.primitive.content.resolver.shared.app-init";
import { resolveLinkAppInit } from "./link.primitive.content.resolver.shared.app-init";

jest.mock("../svg/svg.primitive.content.resolver.shared.app-init", () => ({
  resolveSvgReferenceAppInit: jest.fn(),
}));

const mockedSvgResolver = jest.mocked(resolveSvgReferenceAppInit);

type Input = Parameters<typeof resolveLinkAppInit>[0];
type Authored = Input["authored"];

describe("Link primitive AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];

  const socialProfiles: Input["socialProfiles"] = {
    instagram: "https://instagram.com/wildlife",
    linkedin: "https://linkedin.com/in/wildlife",
  };

  const createLink = (
    kind: "internal" | "social" | "external",
    overrides: Record<string, unknown> = {},
  ): LinkAuthored =>
    ({
      kind,
      label: "Explore",
      ...overrides,
    }) as unknown as LinkAuthored;

  const resolve = (authored: Authored) =>
    resolveLinkAppInit({
      authored,
      svgAssets,
      socialProfiles,
    });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Internal links", () => {
    it("resolves an internal link using its page ID", () => {
      const result = resolve(
        createLink("internal", {
          pageId: "about",
        }),
      );

      expect(result).toMatchObject({
        kind: "internal",
        pageId: "about",
        label: "Explore",
      });

      expect(result).not.toHaveProperty("href");
    });

    it("preserves optional internal link metadata", () => {
      const result = resolve(
        createLink("internal", {
          pageId: "journals",
          label: "Read journals",
          ariaLabel: "Browse journals",
          title: "Journal entries",
          variant: "primary",
          target: "_self",
          rel: ["author"],
        }),
      );

      expect(result).toMatchObject({
        kind: "internal",
        pageId: "journals",
        label: "Read journals",
        ariaLabel: "Browse journals",
        title: "Journal entries",
        variant: "primary",
        target: "_self",
        rel: ["author"],
      });
    });

    it("normalises missing optional metadata to null", () => {
      const result = resolve(
        createLink("internal", {
          pageId: "about",
          label: undefined,
        }),
      );

      expect(result).toEqual({
        kind: "internal",
        pageId: "about",
        label: null,
        ariaLabel: null,
        title: null,
        icon: null,
        variant: null,
        target: null,
        rel: null,
      });
    });
  });

  describe("Social links", () => {
    it("resolves a known social profile to its URL", () => {
      const result = resolve(
        createLink("social", {
          profile: "instagram",
        }),
      );

      expect(result).toMatchObject({
        kind: "external",
        href: socialProfiles.instagram,
        target: "_blank",
        rel: ["noopener", "noreferrer"],
      });

      expect(result).not.toHaveProperty("profile");
    });

    it("resolves different social profiles independently", () => {
      const result = resolve(
        createLink("social", {
          profile: "linkedin",
        }),
      );

      expect(result).toMatchObject({
        kind: "external",
        href: socialProfiles.linkedin,
      });
    });

    it("overrides authored target and rel for social links", () => {
      const result = resolve(
        createLink("social", {
          profile: "instagram",
          target: "_self",
          rel: ["author"],
        }),
      );

      expect(result.target).toBe("_blank");
      expect(result.rel).toEqual(["noopener", "noreferrer"]);
    });

    it("rejects unknown social profiles", () => {
      expect(() =>
        resolve(
          createLink("social", {
            profile: "unknown",
          }),
        ),
      ).toThrow("Unknown social profile: unknown");
    });

    it("rejects a social profile with an empty URL", () => {
      const authored = createLink("social", {
        profile: "empty",
      });

      expect(() =>
        resolveLinkAppInit({
          authored,
          svgAssets,
          socialProfiles: {
            empty: "",
          },
        }),
      ).toThrow("Unknown social profile: empty");
    });
  });

  describe("External links", () => {
    it("resolves an external link using the authored URL", () => {
      const result = resolve(
        createLink("external", {
          href: "https://example.com",
        }),
      );

      expect(result).toMatchObject({
        kind: "external",
        href: "https://example.com",
        target: "_blank",
        rel: ["noopener"],
      });
    });

    it("overrides authored target and rel for external links", () => {
      const result = resolve(
        createLink("external", {
          href: "https://example.com",
          target: "_self",
          rel: ["author"],
        }),
      );

      expect(result.target).toBe("_blank");
      expect(result.rel).toEqual(["noopener"]);
    });

    it("preserves common metadata on external links", () => {
      const result = resolve(
        createLink("external", {
          href: "https://example.com",
          label: "External resource",
          ariaLabel: "Visit external resource",
          title: "Example",
          variant: "secondary",
        }),
      );

      expect(result).toMatchObject({
        kind: "external",
        label: "External resource",
        ariaLabel: "Visit external resource",
        title: "Example",
        variant: "secondary",
      });
    });
  });

  describe("SVG icon resolution", () => {
    it("resolves an authored icon against the SVG registry", () => {
      const icon = {
        id: "icon-camera",
      } as NonNullable<Authored["icon"]>;

      const resolvedIcon = {
        id: "icon-camera",
        width: 24,
        height: 24,
      } as ReturnType<typeof resolveSvgReferenceAppInit>;

      mockedSvgResolver.mockReturnValue(resolvedIcon);

      const result = resolve(
        createLink("internal", {
          pageId: "about",
          icon,
        }),
      );

      expect(mockedSvgResolver).toHaveBeenCalledWith({
        authored: icon,
        registry: svgAssets,
      });

      expect(result.icon).toBe(resolvedIcon);
      expect(mockedSvgResolver).toHaveBeenCalledTimes(1);
    });

    it("returns null when no icon is authored", () => {
      const result = resolve(
        createLink("internal", {
          pageId: "about",
        }),
      );

      expect(result.icon).toBeNull();
      expect(mockedSvgResolver).not.toHaveBeenCalled();
    });

    it("propagates SVG resolution failures", () => {
      const error = new Error("Unknown SVG asset");

      mockedSvgResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolve(
          createLink("internal", {
            pageId: "about",
            icon: { id: "missing" },
          }),
        ),
      ).toThrow(error);
    });
  });

  describe("Data integrity", () => {
    it("does not mutate the authored link", () => {
      const authored = createLink("external", {
        href: "https://example.com",
      });

      const original = { ...authored };

      resolve(authored);

      expect(authored).toEqual(original);
    });

    it("returns a new resolved link object", () => {
      const authored = createLink("internal", {
        pageId: "about",
      });

      const result = resolve(authored);

      expect(result).not.toBe(authored);
    });
  });
});
