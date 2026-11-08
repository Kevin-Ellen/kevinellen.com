// src/shared/resolvers/config/content.config.resolver.shared.app-init.test.ts

import type { ContentAuthored } from "../../../content-schema/content/content.content-schema.authored.type";
import type { ContentAppInit } from "../../types/content/content.shared.app-init.type";

import { resolveContentAppInit } from "../content/content.resolver.shared.app-init";

import { resolveContentConfigAppInit } from "./content.config.resolver.shared.app-init";

jest.mock("../content/content.resolver.shared.app-init", () => ({
  resolveContentAppInit: jest.fn(),
}));

const mockedResolveContentAppInit = jest.mocked(resolveContentAppInit);

type Input = Parameters<typeof resolveContentConfigAppInit>[0];

describe("Content AppInit configuration resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];
  const scriptIds = [] as unknown as Input["scriptIds"];
  const topics = {} as Input["topics"];

  const createAuthored = (
    id: string,
    kind: "public" | "error",
    slug = `/${id}`,
  ): ContentAuthored =>
    ({
      id,
      kind,
      slug,
    }) as unknown as ContentAuthored;

  const createResolved = (id: string, status = 200): ContentAppInit =>
    ({
      id,
      status,
    }) as unknown as ContentAppInit;

  const resolve = (authored: readonly ContentAuthored[]) =>
    resolveContentConfigAppInit({
      authored,
      svgAssets,
      socialProfiles,
      scriptIds,
      topics,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedResolveContentAppInit.mockImplementation(({ authored }) =>
      createResolved(authored.id, authored.kind === "public" ? 200 : 404),
    );
  });

  describe("Content mapping", () => {
    it("returns empty maps when no content is supplied", () => {
      expect(resolve([])).toEqual({
        bySlug: {},
        errorsByStatus: {},
      });

      expect(mockedResolveContentAppInit).not.toHaveBeenCalled();
    });

    it("maps public content by slug", () => {
      const authored = createAuthored("about", "public", "/about");

      const resolved = createResolved("about");

      mockedResolveContentAppInit.mockReturnValue(resolved);

      expect(resolve([authored])).toEqual({
        bySlug: {
          "/about": resolved,
        },
        errorsByStatus: {},
      });
    });

    it("maps multiple public entries by their respective slugs", () => {
      const entries = [
        createAuthored("about", "public", "/about"),
        createAuthored("journal", "public", "/journal"),
      ];

      const result = resolve(entries);

      expect(Object.keys(result.bySlug)).toEqual(["/about", "/journal"]);

      expect(result.bySlug["/about"]?.id).toBe("about");
      expect(result.bySlug["/journal"]?.id).toBe("journal");
      expect(result.errorsByStatus).toEqual({});
    });

    it("maps error content by HTTP status", () => {
      const authored = createAuthored("not-found", "error");

      const resolved = createResolved("not-found", 404);

      mockedResolveContentAppInit.mockReturnValue(resolved);

      expect(resolve([authored])).toEqual({
        bySlug: {},
        errorsByStatus: {
          404: resolved,
        },
      });
    });

    it("maps multiple error pages by status", () => {
      const entries = [
        createAuthored("not-found", "error"),
        createAuthored("server-error", "error"),
      ];

      mockedResolveContentAppInit.mockImplementation(({ authored }) =>
        createResolved(authored.id, authored.id === "not-found" ? 404 : 500),
      );

      const result = resolve(entries);

      expect(result.errorsByStatus[404]?.id).toBe("not-found");
      expect(result.errorsByStatus[500]?.id).toBe("server-error");

      expect(result.bySlug).toEqual({});
    });

    it("keeps public and error content in separate maps", () => {
      const entries = [
        createAuthored("about", "public", "/about"),
        createAuthored("not-found", "error"),
        createAuthored("journal", "public", "/journal"),
        createAuthored("server-error", "error"),
      ];

      mockedResolveContentAppInit.mockImplementation(({ authored }) =>
        createResolved(
          authored.id,
          authored.kind === "public"
            ? 200
            : authored.id === "not-found"
              ? 404
              : 500,
        ),
      );

      const result = resolve(entries);

      expect(Object.keys(result.bySlug)).toEqual(["/about", "/journal"]);

      expect(Object.keys(result.errorsByStatus)).toEqual(["404", "500"]);
    });

    it("uses the resolved error status rather than the authored ID", () => {
      const authored = createAuthored("custom-error", "error");

      mockedResolveContentAppInit.mockReturnValue(
        createResolved("custom-error", 503),
      );

      const result = resolve([authored]);

      expect(result.errorsByStatus[503]?.id).toBe("custom-error");
    });

    it("preserves resolved object references", () => {
      const authored = createAuthored("about", "public");
      const resolved = createResolved("about");

      mockedResolveContentAppInit.mockReturnValue(resolved);

      const result = resolve([authored]);

      expect(result.bySlug["/about"]).toBe(resolved);
    });
  });

  describe("Resolver dependencies", () => {
    it("forwards all dependencies to the content resolver", () => {
      const authored = createAuthored("about", "public");

      resolve([authored]);

      expect(mockedResolveContentAppInit).toHaveBeenCalledWith({
        authored,
        svgAssets,
        socialProfiles,
        scriptIds,
        topics,
      });

      expect(mockedResolveContentAppInit).toHaveBeenCalledTimes(1);
    });

    it("resolves every entry in input order", () => {
      const entries = [
        createAuthored("about", "public"),
        createAuthored("not-found", "error"),
        createAuthored("journal", "public"),
      ];

      resolve(entries);

      expect(mockedResolveContentAppInit).toHaveBeenCalledTimes(3);

      entries.forEach((entry, index) => {
        expect(mockedResolveContentAppInit).toHaveBeenNthCalledWith(
          index + 1,
          expect.objectContaining({
            authored: entry,
          }),
        );
      });
    });

    it("propagates content resolution failures", () => {
      const error = new Error("Content resolution failed");

      mockedResolveContentAppInit.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve([createAuthored("about", "public")])).toThrow(error);
    });

    it("stops processing when a resolver fails", () => {
      const entries = [
        createAuthored("about", "public"),
        createAuthored("journal", "public"),
      ];

      mockedResolveContentAppInit.mockImplementation(() => {
        throw new Error("Resolution failed");
      });

      expect(() => resolve(entries)).toThrow("Resolution failed");

      expect(mockedResolveContentAppInit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Duplicate content validation", () => {
    it("rejects duplicate public content IDs", () => {
      const entries = [
        createAuthored("about", "public", "/about"),
        createAuthored("about", "public", "/about-us"),
      ];

      expect(() => resolve(entries)).toThrow("Duplicate content ID: about");

      expect(mockedResolveContentAppInit).toHaveBeenCalledTimes(1);
    });

    it("rejects duplicate IDs across public and error content", () => {
      const entries = [
        createAuthored("shared", "public", "/shared"),
        createAuthored("shared", "error"),
      ];

      expect(() => resolve(entries)).toThrow("Duplicate content ID: shared");

      expect(mockedResolveContentAppInit).toHaveBeenCalledTimes(1);
    });

    it("rejects duplicate public slugs with different IDs", () => {
      const entries = [
        createAuthored("first", "public", "/shared"),
        createAuthored("second", "public", "/shared"),
      ];

      expect(() => resolve(entries)).toThrow("Duplicate content slug: /shared");

      expect(mockedResolveContentAppInit).toHaveBeenCalledTimes(2);
    });

    it("rejects duplicate error statuses with different IDs", () => {
      const entries = [
        createAuthored("not-found", "error"),
        createAuthored("another-error", "error"),
      ];

      mockedResolveContentAppInit.mockImplementation(({ authored }) =>
        createResolved(authored.id, 404),
      );

      expect(() => resolve(entries)).toThrow("Duplicate error status: 404");

      expect(mockedResolveContentAppInit).toHaveBeenCalledTimes(2);
    });

    it("allows different error statuses", () => {
      const entries = [
        createAuthored("not-found", "error"),
        createAuthored("server-error", "error"),
      ];

      mockedResolveContentAppInit.mockImplementation(({ authored }) =>
        createResolved(authored.id, authored.id === "not-found" ? 404 : 500),
      );

      expect(() => resolve(entries)).not.toThrow();
    });
  });

  describe("Object key safety", () => {
    it("allows public slugs matching inherited object properties", () => {
      const entries = [
        createAuthored("constructor-page", "public", "constructor"),
        createAuthored("to-string-page", "public", "toString"),
      ];

      const result = resolve(entries);

      expect(Object.hasOwn(result.bySlug, "constructor")).toBe(true);

      expect(Object.hasOwn(result.bySlug, "toString")).toBe(true);

      expect(result.bySlug["constructor"]?.id).toBe("constructor-page");

      expect(result.bySlug["toString"]?.id).toBe("to-string-page");
    });

    it("rejects a repeated inherited-property slug", () => {
      const entries = [
        createAuthored("first", "public", "constructor"),
        createAuthored("second", "public", "constructor"),
      ];

      expect(() => resolve(entries)).toThrow(
        "Duplicate content slug: constructor",
      );
    });

    it("allows an error status matching an inherited property key", () => {
      const authored = createAuthored("special-error", "error");

      mockedResolveContentAppInit.mockReturnValue(
        createResolved("special-error", "toString" as unknown as number),
      );

      const result = resolve([authored]);

      expect(Object.hasOwn(result.errorsByStatus, "toString")).toBe(true);
    });
  });

  describe("Data integrity", () => {
    it("does not mutate the authored array", () => {
      const entries = [
        createAuthored("about", "public"),
        createAuthored("journal", "public"),
      ];

      const original = [...entries];

      resolve(entries);

      expect(entries).toEqual(original);
    });

    it("returns fresh mapping objects on each invocation", () => {
      const entries = [createAuthored("about", "public")];

      const first = resolve(entries);
      const second = resolve(entries);

      expect(first).not.toBe(second);
      expect(first.bySlug).not.toBe(second.bySlug);
      expect(first.errorsByStatus).not.toBe(second.errorsByStatus);
    });
  });
});
