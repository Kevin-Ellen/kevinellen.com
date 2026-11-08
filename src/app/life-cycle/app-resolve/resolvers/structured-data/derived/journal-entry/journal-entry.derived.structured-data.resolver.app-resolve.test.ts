// src/app/life-cycle/app-resolve/resolvers/structured-data/derived/journal-entry/journal-entry.derived.structured-data.resolver.app-resolve.test.ts

import type { ContentAppResolve } from "../../../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { SiteConfigAppResolve } from "../../../../../../types/config/site.config.app-resolve.type";
import type { PhotoComponentContentAppResolve } from "../../../../../../types/document/page/content/components/photo/photo.component.content.page.document.app-resolve.type";

import { resolveJournalDerivedStructuredDataAppResolve } from "./journal-entry.derived.structured-data.resolver.app-resolve";

type Photo = PhotoComponentContentAppResolve["photo"];
type Module = ContentAppResolve["body"]["modules"][number];

describe("Journal entry derived structured data AppResolve", () => {
  const site = {
    canonicalDomain: "https://kevinellen.com",
    language: "en-GB",
  } as SiteConfigAppResolve;

  const createPhoto = (overrides: Partial<Photo> = {}): Photo =>
    ({
      id: "fox-001",
      title: "Red Fox",
      alt: "A red fox in Epping Forest",
      commentary: "A quiet encounter",
      dimensions: {
        width: 1200,
        height: 800,
      },
      width: 6000,
      height: 4000,
      capturedAt: {
        utc: "2026-10-01T07:30:00Z",
      },
      photographer: "Test Photographer",
      copyright: "© Test Photographer",
      exposureTime: 0.002,
      aperture: 7.1,
      focalLength: 500,
      iso: 1600,
      readableLocation: "Epping Forest, Essex",
      species: [
        {
          name: "Red fox",
          scientificName: "Vulpes vulpes",
        },
      ],
      ...overrides,
    }) as Photo;

  const createModule = (module: Record<string, unknown>): Module =>
    module as unknown as Module;

  const intro = createModule({
    kind: "pageIntro",
    title: "An Encounter in Epping Forest",
    description: "Observations from an early morning walk",
  });

  const createContent = (
    overrides: Record<string, unknown> = {},
    modules: readonly Module[] = [intro],
  ): ContentAppResolve =>
    ({
      pageType: "journalEntry",
      slug: "/journals/epping-forest",
      metadata: {
        description: "Fallback journal description",
      },
      dates: {
        created: "2026-10-01",
        lastUpdated: null,
      },
      body: {
        modules,
      },
      ...overrides,
    }) as unknown as ContentAppResolve;

  const resolve = (content = createContent(), siteConfig = site) =>
    resolveJournalDerivedStructuredDataAppResolve({
      content,
      site: siteConfig,
    });

  it("returns no graph for non-journal pages", () => {
    expect(resolve(createContent({ pageType: "standard" }))).toEqual([]);
  });

  it("requires a journal slug", () => {
    expect(() => resolve(createContent({ slug: null }))).toThrow(
      "Journal entry requires a slug for structured data",
    );
  });

  it("requires a pageIntro module", () => {
    expect(() => resolve(createContent({}, []))).toThrow(
      "Journal entry missing pageIntro: /journals/epping-forest",
    );
  });

  it("creates an Article even when no photos exist", () => {
    const graph = resolve();

    expect(graph).toHaveLength(1);
    expect(graph[0]).toMatchObject({
      "@type": "Article",
      "@id": "https://kevinellen.com/journals/epping-forest#article",
      url: "https://kevinellen.com/journals/epping-forest",
      headline: "An Encounter in Epping Forest",
      image: [],
    });
  });

  it("maps article identity, language and authorship", () => {
    expect(resolve()[0]).toMatchObject({
      description: "Observations from an early morning walk",
      inLanguage: "en-GB",
      datePublished: "2026-10-01",
      author: {
        "@id": "https://kevinellen.com/#person",
      },
      publisher: {
        "@id": "https://kevinellen.com/#person",
      },
      mainEntityOfPage: {
        "@id": "https://kevinellen.com/journals/epping-forest",
      },
    });
  });

  it("uses metadata description when intro description is absent", () => {
    const withoutDescription = createModule({
      kind: "pageIntro",
      title: "A Journal Entry",
      description: null,
    });

    const graph = resolve(createContent({}, [withoutDescription]));

    expect(graph[0]).toMatchObject({
      description: "Fallback journal description",
    });
  });

  it("includes dateModified when the entry was updated", () => {
    const graph = resolve(
      createContent({
        dates: {
          created: "2026-10-01",
          lastUpdated: "2026-10-15",
        },
      }),
    );

    expect(graph[0]).toMatchObject({
      dateModified: "2026-10-15",
    });
  });

  it("omits dateModified when no update exists", () => {
    expect(resolve()[0]).not.toHaveProperty("dateModified");
  });

  it("normalises a trailing slash in the canonical domain", () => {
    const graph = resolve(createContent(), {
      ...site,
      canonicalDomain: "https://kevinellen.com/",
    });

    expect(graph[0]).toMatchObject({
      "@id": "https://kevinellen.com/journals/epping-forest#article",
      author: {
        "@id": "https://kevinellen.com/#person",
      },
    });
  });

  describe("Photo collection", () => {
    const photo = createPhoto();

    const placements: Array<{
      kind: string;
      create: () => Module;
    }> = [
      {
        kind: "featuredPhoto",
        create: () =>
          createModule({
            kind: "featuredPhoto",
            photo,
          }),
      },
      {
        kind: "richContent",
        create: () =>
          createModule({
            kind: "richContent",
            components: [{ kind: "paragraph" }, { kind: "photo", photo }],
          }),
      },
      {
        kind: "photoPair",
        create: () =>
          createModule({
            kind: "photoPair",
            photos: [{ kind: "photo", photo }],
          }),
      },
      {
        kind: "photoSequence",
        create: () =>
          createModule({
            kind: "photoSequence",
            photos: [{ kind: "photo", photo }],
          }),
      },
      {
        kind: "finalWords",
        create: () =>
          createModule({
            kind: "finalWords",
            components: [{ kind: "paragraph" }, { kind: "photo", photo }],
          }),
      },
      {
        kind: "articleSection",
        create: () =>
          createModule({
            kind: "articleSection",
            entries: [
              {
                module: createModule({
                  kind: "featuredPhoto",
                  photo,
                }),
              },
            ],
          }),
      },
    ];

    it.each(placements)("collects photos from $kind modules", ({ create }) => {
      const graph = resolve(createContent({}, [intro, create()]));

      expect(graph).toHaveLength(2);
      expect(graph[0]).toMatchObject({
        image: [
          {
            "@id":
              "https://kevinellen.com/journals/epping-forest#image-fox-001",
          },
        ],
      });

      expect(graph[1]).toMatchObject({
        "@type": "ImageObject",
        name: "Red Fox",
      });
    });

    it("recursively collects photos from nested article sections", () => {
      const nested = createModule({
        kind: "articleSection",
        entries: [
          {
            module: createModule({
              kind: "articleSection",
              entries: [
                {
                  module: createModule({
                    kind: "featuredPhoto",
                    photo,
                  }),
                },
              ],
            }),
          },
        ],
      });

      expect(resolve(createContent({}, [intro, nested]))).toHaveLength(2);
    });

    it("deduplicates photos by ID", () => {
      const modules = [
        intro,
        placements[0]?.create(),
        placements[1]?.create(),
        placements[2]?.create(),
      ].filter((item): item is Module => item !== undefined);

      const graph = resolve(createContent({}, modules));

      expect(graph).toHaveLength(2);
      expect(graph[0]).toMatchObject({
        image: [
          {
            "@id":
              "https://kevinellen.com/journals/epping-forest#image-fox-001",
          },
        ],
      });
    });

    it("preserves first-seen ordering of different photo IDs", () => {
      const first = createPhoto({ id: "fox-001" });
      const second = createPhoto({ id: "deer-002" });

      const graph = resolve(
        createContent({}, [
          intro,
          createModule({ kind: "featuredPhoto", photo: first }),
          createModule({
            kind: "photoSequence",
            photos: [{ kind: "photo", photo: second }],
          }),
        ]),
      );

      expect(graph).toHaveLength(3);
      expect(graph[1]).toMatchObject({ name: first.title });
      expect(graph[2]).toMatchObject({ name: second.title });
    });

    it("ignores non-photo components", () => {
      const module = createModule({
        kind: "richContent",
        components: [{ kind: "paragraph" }, { kind: "list" }],
      });

      expect(resolve(createContent({}, [intro, module]))).toHaveLength(1);
    });
  });

  describe("ImageObject mapping", () => {
    const resolvePhoto = (overrides: Partial<Photo> = {}) =>
      resolve(
        createContent({}, [
          intro,
          createModule({
            kind: "featuredPhoto",
            photo: createPhoto(overrides),
          }),
        ]),
      );

    it("maps image URLs and metadata", () => {
      const graph = resolvePhoto();

      expect(graph[1]).toMatchObject({
        "@type": "ImageObject",
        "@id": "https://kevinellen.com/journals/epping-forest#image-fox-001",
        url: "https://kevinellen.com/media/photo/1200/800/fox-001",
        contentUrl: "https://kevinellen.com/media/photo/1200/800/fox-001",
        name: "Red Fox",
        description: "A red fox in Epping Forest",
        caption: "A quiet encounter",
        dateCreated: "2026-10-01T07:30:00Z",
        creator: {
          "@id": "https://kevinellen.com/#person",
        },
        creditText: "Test Photographer",
        copyrightNotice: "© Test Photographer",
        license: "https://kevinellen.com/legal/licensing",
        acquireLicensePage: "https://kevinellen.com/legal/licensing",
      });
    });

    it("maps image dimensions as QuantitativeValue entities", () => {
      expect(resolvePhoto()[1]).toMatchObject({
        width: {
          "@type": "QuantitativeValue",
          value: 6000,
          unitCode: "E37",
        },
        height: {
          "@type": "QuantitativeValue",
          value: 4000,
          unitCode: "E37",
        },
      });
    });

    it("encodes photo IDs in URLs", () => {
      expect(resolvePhoto({ id: "fox image/001" })[1]).toMatchObject({
        url: "https://kevinellen.com/media/photo/1200/800/fox%20image%2F001",
      });
    });

    it("uses alt text when commentary is absent", () => {
      expect(resolvePhoto({ commentary: undefined })[1]).toMatchObject({
        caption: "A red fox in Epping Forest",
      });
    });

    it("includes readable location when available", () => {
      expect(resolvePhoto()[1]).toMatchObject({
        contentLocation: {
          "@type": "Place",
          name: "Epping Forest, Essex",
        },
      });
    });

    it("omits location when unavailable", () => {
      expect(resolvePhoto({ readableLocation: null })[1]).not.toHaveProperty(
        "contentLocation",
      );
    });

    it("maps species to Taxon entities", () => {
      expect(resolvePhoto()[1]).toMatchObject({
        about: [
          {
            "@type": "Taxon",
            name: "Red fox",
            scientificName: "Vulpes vulpes",
            taxonRank: "species",
          },
        ],
      });
    });

    it("omits taxonomy when species is undefined", () => {
      expect(resolvePhoto({ species: undefined })[1]).not.toHaveProperty(
        "about",
      );
    });

    it("omits taxonomy when no species exist", () => {
      expect(resolvePhoto({ species: [] })[1]).not.toHaveProperty("about");
    });

    it("maps valid EXIF properties and their units", () => {
      expect(resolvePhoto()[1]).toMatchObject({
        exifData: [
          {
            "@type": "PropertyValue",
            name: "ExposureTime",
            value: 0.002,
            unitText: "seconds",
          },
          {
            "@type": "PropertyValue",
            name: "FNumber",
            value: 7.1,
          },
          {
            "@type": "PropertyValue",
            name: "FocalLength",
            value: 500,
            unitText: "mm",
          },
          {
            "@type": "PropertyValue",
            name: "PhotographicSensitivity",
            value: 1600,
          },
        ],
      });
    });

    it("filters null and non-finite EXIF values", () => {
      const graph = resolvePhoto({
        exposureTime: undefined,
        aperture: Number.NaN,
        focalLength: Number.POSITIVE_INFINITY,
        iso: 0,
      });

      expect(graph[1]).toMatchObject({
        exifData: [
          {
            name: "PhotographicSensitivity",
            value: 0,
          },
        ],
      });
    });

    it("omits exifData when no valid properties exist", () => {
      expect(
        resolvePhoto({
          exposureTime: undefined,
          aperture: undefined,
          focalLength: undefined,
          iso: undefined,
        })[1],
      ).not.toHaveProperty("exifData");
    });
  });
});
