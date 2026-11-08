// src/app/life-cycle/app-resolve/getters/content/content.getter.app-resolve.test.ts

import { getContentAppResolve } from "./content.getter.app-resolve";

import { getBundledContentAppResolve } from "./bundled/bundled.content.getter.app-resolve";
import { getKvContentAppResolve } from "./kv/kv.content.getter.app-resolve";

jest.mock("./bundled/bundled.content.getter.app-resolve", () => ({
  getBundledContentAppResolve: jest.fn(),
}));

jest.mock("./kv/kv.content.getter.app-resolve", () => ({
  getKvContentAppResolve: jest.fn(),
}));

const mockedBundled = jest.mocked(getBundledContentAppResolve);
const mockedKv = jest.mocked(getKvContentAppResolve);

type Input = Parameters<typeof getContentAppResolve>[0];
type Routing = Input["routing"];
type Content = ReturnType<typeof getBundledContentAppResolve>;

describe("Content getter AppResolve", () => {
  const bundledPage = {
    id: "bundled-page",
  } as Content;

  const publishedPage = {
    id: "published-page",
  } as Content;

  const notFoundPage = {
    id: "not-found",
    status: 404,
  } as Content;

  const appInit = {} as Input["appInit"];

  const kv = {} as Input["env"]["CONTENT_KV"];

  const env = {
    CONTENT_KV: kv,
  } as Input["env"];

  const bundledRouting = {
    kind: "selected",
    source: "bundled",
    contentPathname: "/about",
  } as Routing;

  const publishedRouting = {
    kind: "selected",
    source: "published",
    contentPathname: "/journals/test-entry",
  } as Routing;

  const notFoundRouting = {
    kind: "not-found",
    status: 404,
  } as Routing;

  const createRegistry = (
    entries: Record<string, unknown> = {},
  ): Input["contentRegistry"] =>
    ({
      bySlug: entries,
    }) as Input["contentRegistry"];

  const publishedEntry = {
    id: "test-entry",
    source: "published",
  };

  const createInput = (
    routing: Routing,
    registry = createRegistry(),
  ): Input => ({
    appInit,
    routing,
    env,
    contentRegistry: registry,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedBundled.mockImplementation(({ status }) =>
      status === 404 ? notFoundPage : bundledPage,
    );

    mockedKv.mockResolvedValue({
      kind: "found",
      content: publishedPage,
    });
  });

  describe("Not-found routing", () => {
    it("resolves bundled 404 content", async () => {
      const result = await getContentAppResolve(createInput(notFoundRouting));

      expect(result).toBe(notFoundPage);

      expect(mockedBundled).toHaveBeenCalledWith({
        appInit,
        status: 404,
      });
    });

    it("does not read KV for a not-found route", async () => {
      await getContentAppResolve(createInput(notFoundRouting));

      expect(mockedKv).not.toHaveBeenCalled();
    });
  });

  describe("Bundled routing", () => {
    it("resolves bundled content by pathname", async () => {
      const result = await getContentAppResolve(createInput(bundledRouting));

      expect(result).toBe(bundledPage);

      expect(mockedBundled).toHaveBeenCalledWith({
        appInit,
        slug: "/about",
      });
    });

    it("does not read KV for bundled content", async () => {
      await getContentAppResolve(createInput(bundledRouting));

      expect(mockedKv).not.toHaveBeenCalled();
    });

    it("propagates missing bundled content errors", async () => {
      mockedBundled.mockImplementation(() => {
        throw new Error("Bundled content not found");
      });

      await expect(
        getContentAppResolve(createInput(bundledRouting)),
      ).rejects.toThrow("Bundled content not found");
    });
  });

  describe("Published routing", () => {
    const registry = createRegistry({
      "/journals/test-entry": publishedEntry,
    });

    it("reads the published registry entry", async () => {
      const result = await getContentAppResolve(
        createInput(publishedRouting, registry),
      );

      expect(result).toBe(publishedPage);

      expect(mockedKv).toHaveBeenCalledWith({
        kv,
        key: "journal:appInit:test-entry",
        expectedId: "test-entry",
        expectedSlug: "/journals/test-entry",
      });

      expect(mockedKv).toHaveBeenCalledTimes(1);
      expect(mockedBundled).not.toHaveBeenCalled();
    });

    it("returns bundled 404 when the registry entry is missing", async () => {
      const result = await getContentAppResolve(createInput(publishedRouting));

      expect(result).toBe(notFoundPage);

      expect(mockedBundled).toHaveBeenCalledWith({
        appInit,
        status: 404,
      });

      expect(mockedKv).not.toHaveBeenCalled();
    });

    it("returns bundled 404 when the registry entry is not published", async () => {
      const invalidRegistry = createRegistry({
        "/journals/test-entry": {
          id: "test-entry",
          source: "bundled",
        },
      });

      const result = await getContentAppResolve(
        createInput(publishedRouting, invalidRegistry),
      );

      expect(result).toBe(notFoundPage);

      expect(mockedBundled).toHaveBeenCalledWith({
        appInit,
        status: 404,
      });

      expect(mockedKv).not.toHaveBeenCalled();
    });

    it("returns bundled 404 when KV content is missing", async () => {
      mockedKv.mockResolvedValue({
        kind: "not-found",
        status: 404,
      });

      const result = await getContentAppResolve(
        createInput(publishedRouting, registry),
      );

      expect(result).toBe(notFoundPage);

      expect(mockedKv).toHaveBeenCalledTimes(1);

      expect(mockedBundled).toHaveBeenCalledWith({
        appInit,
        status: 404,
      });
    });

    it("preserves the published content reference", async () => {
      const result = await getContentAppResolve(
        createInput(publishedRouting, registry),
      );

      expect(result).toBe(publishedPage);
    });

    it("uses the registry ID rather than the pathname as the KV key", async () => {
      const customRegistry = createRegistry({
        "/journals/test-entry": {
          id: "different-published-id",
          source: "published",
        },
      });

      await getContentAppResolve(createInput(publishedRouting, customRegistry));

      expect(mockedKv).toHaveBeenCalledWith({
        kv,
        key: "journal:appInit:different-published-id",
        expectedId: "different-published-id",
        expectedSlug: "/journals/test-entry",
      });
    });

    it("propagates KV read failures", async () => {
      const error = new Error("KV read failed");

      mockedKv.mockRejectedValue(error);

      await expect(
        getContentAppResolve(createInput(publishedRouting, registry)),
      ).rejects.toThrow(error);
    });

    it("propagates bundled fallback failures", async () => {
      const error = new Error("Missing bundled 404 page");

      mockedKv.mockResolvedValue({
        kind: "not-found",
        status: 404,
      });

      mockedBundled.mockImplementation(() => {
        throw error;
      });

      await expect(
        getContentAppResolve(createInput(publishedRouting, registry)),
      ).rejects.toThrow(error);
    });
  });
});
