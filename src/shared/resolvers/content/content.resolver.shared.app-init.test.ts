// src/shared/resolvers/content/content.resolver.shared.app-init.test.ts

import type { ContentAuthored } from "../../../content-schema/content/content.content-schema.authored.type";

import { resolveContentBodyAppInit } from "./body/body.content.resolver.shared.app-init";
import { resolveStructuredDataAppInit } from "./structured-data/structured-data.content.resolver.shared.app-init";

import { resolveContentAppInit } from "./content.resolver.shared.app-init";

jest.mock("./body/body.content.resolver.shared.app-init", () => ({
  resolveContentBodyAppInit: jest.fn(),
}));

jest.mock(
  "./structured-data/structured-data.content.resolver.shared.app-init",
  () => ({
    resolveStructuredDataAppInit: jest.fn(),
  }),
);

const mockedBodyResolver = jest.mocked(resolveContentBodyAppInit);
const mockedStructuredDataResolver = jest.mocked(resolveStructuredDataAppInit);

type Input = Parameters<typeof resolveContentAppInit>[0];
type Authored = Input["authored"];
type ResolvedBody = ReturnType<typeof resolveContentBodyAppInit>;
type ResolvedStructuredData = ReturnType<typeof resolveStructuredDataAppInit>;

describe("Content AppInit resolver", () => {
  const svgAssets = {} as Input["svgAssets"];
  const socialProfiles = {} as Input["socialProfiles"];
  const topics = {} as Input["topics"];

  const scriptIds = ["site", "analytics"] as unknown as Input["scriptIds"];

  const createAuthored = (overrides: Record<string, unknown> = {}): Authored =>
    ({
      id: "about",
      kind: "public",
      pageType: "page",
      render: "static",
      label: "About",
      slug: "/about",
      status: undefined,
      breadcrumbs: [],
      dates: {
        created: "2026-10-19",
      },
      metadata: {
        title: "About",
        description: "Wildlife photography in Essex",
        sitemap: true,
      },
      body: {
        modules: [],
      },
      ...overrides,
    }) as unknown as ContentAuthored;

  const resolve = (
    authored: Authored,
    overrides: Partial<Omit<Input, "authored">> = {},
  ) =>
    resolveContentAppInit({
      authored,
      svgAssets,
      socialProfiles,
      scriptIds,
      topics,
      ...overrides,
    });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedBodyResolver.mockReturnValue({
      modules: [],
      footer: [],
    });

    mockedStructuredDataResolver.mockReturnValue({
      "@context": "https://schema.org",
      "@graph": [],
    });
  });

  describe("Content kind validation", () => {
    it("resolves public content", () => {
      const result = resolve(createAuthored());

      expect(result.kind).toBe("public");
      expect(result.slug).toBe("/about");
      expect(result.status).toBe(200);
    });

    it("resolves error content", () => {
      const authored = createAuthored({
        id: "not-found",
        kind: "error",
        pageType: "error",
        status: 404,
      });

      const result = resolve(authored);

      expect(result).toMatchObject({
        id: "not-found",
        kind: "error",
        status: 404,
        slug: null,
      });
    });

    it("rejects unsupported content kinds", () => {
      const authored = createAuthored({
        kind: "unknown",
      });

      expect(() => resolve(authored)).toThrow(
        "Unsupported content kind: unknown",
      );

      expect(mockedBodyResolver).not.toHaveBeenCalled();
    });

    it("rejects an undefined content kind", () => {
      const authored = createAuthored({
        kind: undefined,
      });

      expect(() => resolve(authored)).toThrow(
        "Unsupported content kind: undefined",
      );
    });

    it("requires a status for error content", () => {
      const authored = createAuthored({
        id: "missing-status",
        kind: "error",
        status: undefined,
      });

      expect(() => resolve(authored)).toThrow(
        'Error content "missing-status" requires a status',
      );

      expect(mockedBodyResolver).not.toHaveBeenCalled();
    });

    it("accepts an explicitly supplied error status", () => {
      const result = resolve(
        createAuthored({
          id: "server-error",
          kind: "error",
          status: 500,
        }),
      );

      expect(result.status).toBe(500);
    });

    it("preserves an explicit public status", () => {
      const result = resolve(
        createAuthored({
          status: 201,
        }),
      );

      expect(result.status).toBe(201);
    });
  });

  describe("Script resolution", () => {
    it("defaults missing public scripts to an empty array", () => {
      const result = resolve(createAuthored());

      expect(result.scripts).toEqual([]);
    });

    it("resolves registered scripts", () => {
      const authored = createAuthored({
        scripts: ["site", "analytics"],
      });

      const result = resolve(authored);

      expect(result.scripts).toEqual(["site", "analytics"]);
    });

    it("preserves the order of authored scripts", () => {
      const result = resolve(
        createAuthored({
          scripts: ["analytics", "site"],
        }),
      );

      expect(result.scripts).toEqual(["analytics", "site"]);
    });

    it("preserves repeated registered script IDs", () => {
      const result = resolve(
        createAuthored({
          scripts: ["site", "site"],
        }),
      );

      expect(result.scripts).toEqual(["site", "site"]);
    });

    it("rejects an unknown script", () => {
      const authored = createAuthored({
        scripts: ["missing-script"],
      });

      expect(() => resolve(authored)).toThrow(
        'Unknown script "missing-script" in content "about"',
      );

      expect(mockedBodyResolver).not.toHaveBeenCalled();
    });

    it("rejects a script absent from the supplied registry", () => {
      const authored = createAuthored({
        scripts: ["site"],
      });

      expect(() =>
        resolve(authored, {
          scriptIds: [],
        }),
      ).toThrow('Unknown script "site" in content "about"');
    });

    it("does not resolve scripts for error content", () => {
      const authored = createAuthored({
        id: "not-found",
        kind: "error",
        status: 404,
        scripts: ["missing-script"],
      });

      const result = resolve(authored);

      expect(result.scripts).toEqual([]);
    });
  });

  describe("Page presentation", () => {
    it("applies the default page presentation", () => {
      const result = resolve(createAuthored());

      expect(result.pagePresentation).toEqual({
        layout: "contained",
        header: {
          transparent: false,
          inverted: false,
        },
      });
    });

    it("resolves transparent headers", () => {
      const result = resolve(
        createAuthored({
          pagePresentation: {
            layout: "contained",
            header: {
              appearance: "transparent",
              colourScheme: "default",
            },
          },
        }),
      );

      expect(result.pagePresentation.header).toEqual({
        transparent: true,
        inverted: false,
      });
    });

    it("resolves inverted colour schemes", () => {
      const result = resolve(
        createAuthored({
          pagePresentation: {
            layout: "contained",
            header: {
              appearance: "solid",
              colourScheme: "inverted",
            },
          },
        }),
      );

      expect(result.pagePresentation.header).toEqual({
        transparent: false,
        inverted: true,
      });
    });

    it("resolves transparent and inverted headers together", () => {
      const result = resolve(
        createAuthored({
          pagePresentation: {
            layout: "full",
            header: {
              appearance: "transparent",
              colourScheme: "inverted",
            },
          },
        }),
      );

      expect(result.pagePresentation).toEqual({
        layout: "full",
        header: {
          transparent: true,
          inverted: true,
        },
      });
    });

    it("does not mutate authored presentation settings", () => {
      const pagePresentation = {
        layout: "contained",
        header: {
          appearance: "transparent",
          colourScheme: "inverted",
        },
      };

      const authored = createAuthored({ pagePresentation });

      resolve(authored);

      expect(pagePresentation).toEqual({
        layout: "contained",
        header: {
          appearance: "transparent",
          colourScheme: "inverted",
        },
      });
    });
  });

  describe("Date resolution", () => {
    it("preserves the authored creation date", () => {
      const result = resolve(createAuthored());

      expect(result.dates.created).toBe("2026-10-19");
    });

    it("defaults missing lastUpdated to null", () => {
      const result = resolve(createAuthored());

      expect(result.dates.lastUpdated).toBeNull();
    });

    it("preserves an authored lastUpdated date", () => {
      const result = resolve(
        createAuthored({
          dates: {
            created: "2026-10-19",
            lastUpdated: "2026-11-04",
          },
        }),
      );

      expect(result.dates).toEqual({
        created: "2026-10-19",
        lastUpdated: "2026-11-04",
      });
    });

    it("creates a new dates object", () => {
      const authored = createAuthored();

      const result = resolve(authored);

      expect(result.dates).not.toBe(authored.dates);
    });
  });

  describe("Metadata resolution", () => {
    it("preserves public metadata", () => {
      const result = resolve(createAuthored());

      expect(result.metadata).toEqual({
        title: "About",
        description: "Wildlife photography in Essex",
        sitemap: true,
      });
    });

    it("disables sitemap inclusion for error content", () => {
      const result = resolve(
        createAuthored({
          kind: "error",
          id: "not-found",
          status: 404,
          metadata: {
            title: "Not found",
            description: "Page not found",
            sitemap: true,
          },
        }),
      );

      expect(result.metadata).toEqual({
        title: "Not found",
        description: "Page not found",
        sitemap: false,
      });
    });

    it("preserves an explicitly disabled public sitemap", () => {
      const result = resolve(
        createAuthored({
          metadata: {
            title: "About",
            description: "About the photographer",
            sitemap: false,
          },
        }),
      );

      expect(result.metadata.sitemap).toBe(false);
    });
  });

  describe("Topic resolution", () => {
    it("defaults missing public topics to an empty array", () => {
      const result = resolve(createAuthored());

      expect(result.topics).toEqual([]);
    });

    it("preserves authored public topics", () => {
      const authoredTopics = ["essex", "wildlife-behaviour"];

      const result = resolve(
        createAuthored({
          topics: authoredTopics,
        }),
      );

      expect(result.topics).toBe(authoredTopics);
    });

    it("excludes topics from error content", () => {
      const result = resolve(
        createAuthored({
          kind: "error",
          id: "not-found",
          status: 404,
          topics: ["essex"],
        }),
      );

      expect(result.topics).toEqual([]);
    });
  });

  describe("Structured data resolution", () => {
    it("returns null when public structured data is absent", () => {
      const result = resolve(createAuthored());

      expect(result.structuredData).toBeNull();

      expect(mockedStructuredDataResolver).not.toHaveBeenCalled();
    });

    it("resolves structured data for public content", () => {
      const structuredData = {
        "@graph": [
          {
            "@type": "Person",
            name: "Kevin Ellen",
          },
        ],
      };

      const resolved = {
        "@context": "https://schema.org",
        "@graph": structuredData["@graph"],
      } as ResolvedStructuredData;

      mockedStructuredDataResolver.mockReturnValue(resolved);

      const result = resolve(
        createAuthored({
          structuredData,
        }),
      );

      expect(mockedStructuredDataResolver).toHaveBeenCalledWith(structuredData);

      expect(mockedStructuredDataResolver).toHaveBeenCalledTimes(1);
      expect(result.structuredData).toBe(resolved);
    });

    it("excludes structured data from error content", () => {
      const result = resolve(
        createAuthored({
          kind: "error",
          id: "not-found",
          status: 404,
          structuredData: {
            "@graph": [],
          },
        }),
      );

      expect(result.structuredData).toBeNull();

      expect(mockedStructuredDataResolver).not.toHaveBeenCalled();
    });

    it("propagates structured data resolution failures", () => {
      const error = new Error("Structured data resolution failed");

      mockedStructuredDataResolver.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        resolve(
          createAuthored({
            structuredData: {
              "@graph": [],
            },
          }),
        ),
      ).toThrow(error);

      expect(mockedBodyResolver).not.toHaveBeenCalled();
    });
  });

  describe("Body resolution", () => {
    it("forwards the authored body and shared dependencies", () => {
      const authored = createAuthored();

      resolve(authored);

      expect(mockedBodyResolver).toHaveBeenCalledWith({
        authored: authored.body,
        svgAssets,
        socialProfiles,
        dates: {
          created: "2026-10-19",
          lastUpdated: null,
        },
        topics,
      });

      expect(mockedBodyResolver).toHaveBeenCalledTimes(1);
    });

    it("preserves the resolved body reference", () => {
      const body = {
        modules: [],
        footer: [],
      } as ResolvedBody;

      mockedBodyResolver.mockReturnValue(body);

      const result = resolve(createAuthored());

      expect(result.body).toBe(body);
    });

    it("passes resolved dates rather than authored dates", () => {
      const authored = createAuthored();

      resolve(authored);

      const input = mockedBodyResolver.mock.calls[0]?.[0];

      expect(input?.dates).toEqual({
        created: "2026-10-19",
        lastUpdated: null,
      });

      expect(input?.dates).not.toBe(authored.dates);
    });

    it("propagates body resolution failures", () => {
      const error = new Error("Body resolution failed");

      mockedBodyResolver.mockImplementation(() => {
        throw error;
      });

      expect(() => resolve(createAuthored())).toThrow(error);
    });

    it("resolves structured data before the body", () => {
      resolve(
        createAuthored({
          structuredData: {
            "@graph": [],
          },
        }),
      );

      expect(
        mockedStructuredDataResolver.mock.invocationCallOrder[0],
      ).toBeLessThan(mockedBodyResolver.mock.invocationCallOrder[0]);
    });
  });

  describe("Content integrity", () => {
    it("preserves core authored properties", () => {
      const authored = createAuthored({
        id: "journal",
        label: "Journal",
        slug: "/journals",
      });

      const result = resolve(authored);

      expect(result.id).toBe("journal");
      expect(result.label).toBe("Journal");
      expect(result.slug).toBe("/journals");
      expect(result.pageType).toBe(authored.pageType);
      expect(result.render).toBe(authored.render);
      expect(result.breadcrumbs).toBe(authored.breadcrumbs);
    });

    it("does not mutate authored content", () => {
      const authored = createAuthored();

      const original = {
        ...authored,
        dates: { ...authored.dates },
        metadata: { ...authored.metadata },
      };

      resolve(authored);

      expect(authored).toEqual(original);
    });

    it("returns a new resolved content object", () => {
      const authored = createAuthored();

      expect(resolve(authored)).not.toBe(authored);
    });

    it("returns fresh metadata and presentation objects", () => {
      const authored = createAuthored();

      const first = resolve(authored);
      const second = resolve(authored);

      expect(first).not.toBe(second);
      expect(first.metadata).not.toBe(second.metadata);
      expect(first.pagePresentation).not.toBe(second.pagePresentation);
      expect(first.pagePresentation.header).not.toBe(
        second.pagePresentation.header,
      );
    });

    it("does not copy unrelated authored properties", () => {
      const authored = createAuthored({
        customProperty: "not included",
      });

      const result = resolve(authored);

      expect(result).not.toHaveProperty("customProperty");
    });
  });
});
