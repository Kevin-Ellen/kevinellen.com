// src/app/life-cycle/app-resolve/resolvers/content/open-graph/open-graph.content.resolver.app-resolve.test.ts

import { resolveOpenGraphAppResolve } from "./open-graph.content.resolver.app-resolve";

type Input = Parameters<typeof resolveOpenGraphAppResolve>[0];
type RegistryEntry = NonNullable<Input["registryEntry"]>;

const canonicalDomain = "https://kevinellen.com";
const canonicalUrl = `${canonicalDomain}/journal/test-entry`;

const createBundledEntry = (
  photos: readonly {
    src: string;
    width: number | null;
    height: number | null;
  }[] = [
    {
      src: "/assets/images/forest.jpg",
      width: 2,
      height: 3,
    },
  ],
): RegistryEntry => ({
  source: "bundled",
  id: "test-page",
  slug: "/test-page",
  label: "Test Page",
  photos,
});

const createPublishedEntry = (
  photos: readonly {
    id: string;
    width: number;
    height: number;
  }[] = [
    {
      id: "marsh-harrier",
      width: 2837,
      height: 1891,
    },
  ],
): RegistryEntry => ({
  source: "published",
  id: "test-entry",
  slug: "/journal/test-entry",
  label: "Test Entry",
  photos,
  dateCreated: "2026-10-15",
  intro: "A wildlife encounter",
  title: "Test Entry",
});

const createInput = (overrides: Partial<Input> = {}): Input => ({
  pageType: "standard",
  title: "Wildlife Photography",
  description: "Wildlife encounters in Essex",
  language: "en-GB",
  canonicalUrl,
  canonicalDomain,
  openGraph: null,
  registryEntry: null,
  ...overrides,
});

describe("Open Graph AppResolve resolver", () => {
  describe("base metadata", () => {
    it("resolves standard pages as websites", () => {
      const result = resolveOpenGraphAppResolve(createInput());

      expect(result.type).toBe("website");
    });

    it("resolves journal entries as articles", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({ pageType: "journalEntry" }),
      );

      expect(result.type).toBe("article");
    });

    it("uses the supplied title, description and canonical URL", () => {
      const result = resolveOpenGraphAppResolve(createInput());

      expect(result).toEqual({
        type: "website",
        title: "Wildlife Photography",
        description: "Wildlife encounters in Essex",
        language: "en_GB",
        url: canonicalUrl,
        image: null,
        imageWidth: null,
        imageHeight: null,
      });
    });

    it("uses authored title and description overrides", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          openGraph: {
            title: "Custom Open Graph Title",
            description: "Custom Open Graph Description",
          },
        }),
      );

      expect(result.title).toBe("Custom Open Graph Title");
      expect(result.description).toBe("Custom Open Graph Description");
      expect(result.url).toBe(canonicalUrl);
    });

    it("falls back to the page title when only the description is overridden", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          openGraph: {
            description: "Custom description",
          },
        }),
      );

      expect(result.title).toBe("Wildlife Photography");
      expect(result.description).toBe("Custom description");
    });

    it("falls back to the page description when only the title is overridden", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          openGraph: {
            title: "Custom title",
          },
        }),
      );

      expect(result.title).toBe("Custom title");
      expect(result.description).toBe("Wildlife encounters in Essex");
    });

    it("returns null image metadata when no registry entry or image override exists", () => {
      const result = resolveOpenGraphAppResolve(createInput());

      expect(result.image).toBeNull();
      expect(result.imageWidth).toBeNull();
      expect(result.imageHeight).toBeNull();
    });

    it("rejects an image override without a matching registry entry", () => {
      expect(() =>
        resolveOpenGraphAppResolve(
          createInput({
            openGraph: {
              image: "missing-photo",
            },
          }),
        ),
      ).toThrow('Open Graph image "missing-photo" has no registry entry');
    });
  });

  describe("bundled photographs", () => {
    it("selects the first bundled photograph by default", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createBundledEntry([
            {
              src: "/assets/images/first.jpg",
              width: 2,
              height: 3,
            },
            {
              src: "/assets/images/second.jpg",
              width: 3,
              height: 2,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/assets/images/first.jpg",
      );
    });

    it("does not treat bundled aspect ratios as pixel dimensions", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createBundledEntry(),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/assets/images/forest.jpg",
      );
      expect(result.imageWidth).toBeNull();
      expect(result.imageHeight).toBeNull();
    });

    it("handles bundled photographs with unknown dimensions", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createBundledEntry([
            {
              src: "/assets/images/unknown.jpg",
              width: null,
              height: null,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/assets/images/unknown.jpg",
      );
      expect(result.imageWidth).toBeNull();
      expect(result.imageHeight).toBeNull();
    });

    it("selects a matching bundled photograph override", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createBundledEntry([
            {
              src: "/assets/images/first.jpg",
              width: 2,
              height: 3,
            },
            {
              src: "/assets/images/second.jpg",
              width: 3,
              height: 2,
            },
          ]),
          openGraph: {
            image: "/assets/images/second.jpg",
          },
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/assets/images/second.jpg",
      );
    });

    it("resolves a dedicated bundled Open Graph asset outside the registry", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createBundledEntry(),
          openGraph: {
            image: "/assets/images/homepage-open-graph-1200x630.jpg",
            width: 1200,
            height: 630,
          },
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/assets/images/homepage-open-graph-1200x630.jpg",
      );
      expect(result.imageWidth).toBe(1200);
      expect(result.imageHeight).toBe(630);
    });

    it("allows a dedicated bundled image without a registry entry", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: null,
          openGraph: {
            image: "/assets/images/social.jpg",
            width: 1200,
            height: 630,
          },
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/assets/images/social.jpg",
      );
      expect(result.imageWidth).toBe(1200);
      expect(result.imageHeight).toBe(630);
    });

    it("returns null image dimensions for a dedicated asset without authored dimensions", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          openGraph: {
            image: "/assets/images/social.jpg",
          },
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/assets/images/social.jpg",
      );
      expect(result.imageWidth).toBeNull();
      expect(result.imageHeight).toBeNull();
    });

    it("returns no image for an empty bundled registry", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createBundledEntry([]),
        }),
      );

      expect(result.image).toBeNull();
      expect(result.imageWidth).toBeNull();
      expect(result.imageHeight).toBeNull();
    });

    it("rejects a missing non-asset bundled override", () => {
      expect(() =>
        resolveOpenGraphAppResolve(
          createInput({
            registryEntry: createBundledEntry(),
            openGraph: {
              image: "/other/missing.jpg",
            },
          }),
        ),
      ).toThrow(
        'Open Graph image "/other/missing.jpg" not found in bundled registry',
      );
    });
  });

  describe("published photographs", () => {
    it("selects the first published photograph by default", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          pageType: "journalEntry",
          registryEntry: createPublishedEntry([
            {
              id: "first-photo",
              width: 1200,
              height: 630,
            },
            {
              id: "second-photo",
              width: 1600,
              height: 900,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/1200/630/first-photo",
      );
    });

    it("preserves landscape aspect ratios within 1200 by 630", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "marsh-harrier",
              width: 2837,
              height: 1891,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/945/630/marsh-harrier",
      );
      expect(result.imageWidth).toBe(945);
      expect(result.imageHeight).toBe(630);
    });

    it("preserves portrait aspect ratios within 1200 by 630", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "portrait-kestrel",
              width: 2610,
              height: 4640,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/354/630/portrait-kestrel",
      );
      expect(result.imageWidth).toBe(354);
      expect(result.imageHeight).toBe(630);
    });

    it("contains square photographs within the height limit", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "square-photo",
              width: 3000,
              height: 3000,
            },
          ]),
        }),
      );

      expect(result.imageWidth).toBe(630);
      expect(result.imageHeight).toBe(630);
    });

    it("constrains panoramic photographs by width", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "panorama",
              width: 20224,
              height: 3296,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/1200/196/panorama",
      );
      expect(result.imageWidth).toBe(1200);
      expect(result.imageHeight).toBe(196);
    });

    it("does not upscale small photographs", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "small-photo",
              width: 400,
              height: 300,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/400/300/small-photo",
      );
      expect(result.imageWidth).toBe(400);
      expect(result.imageHeight).toBe(300);
    });

    it("preserves photographs that already fit the target bounds", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "fitting-photo",
              width: 1000,
              height: 500,
            },
          ]),
        }),
      );

      expect(result.imageWidth).toBe(1000);
      expect(result.imageHeight).toBe(500);
    });

    it("preserves exact target dimensions", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "exact-photo",
              width: 1200,
              height: 630,
            },
          ]),
        }),
      );

      expect(result.imageWidth).toBe(1200);
      expect(result.imageHeight).toBe(630);
    });

    it("selects an explicitly authored published photograph", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "first-photo",
              width: 1600,
              height: 900,
            },
            {
              id: "chosen-photo",
              width: 2400,
              height: 1200,
            },
          ]),
          openGraph: {
            image: "chosen-photo",
          },
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/1200/600/chosen-photo",
      );
      expect(result.imageWidth).toBe(1200);
      expect(result.imageHeight).toBe(600);
    });

    it("URL-encodes published photograph identifiers", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "bird photo/essex",
              width: 1200,
              height: 630,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/1200/630/bird%20photo%2Fessex",
      );
    });

    it("returns no image for an empty published registry", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([]),
        }),
      );

      expect(result.image).toBeNull();
      expect(result.imageWidth).toBeNull();
      expect(result.imageHeight).toBeNull();
    });

    it("rejects a published override missing from the registry", () => {
      expect(() =>
        resolveOpenGraphAppResolve(
          createInput({
            registryEntry: createPublishedEntry(),
            openGraph: {
              image: "missing-bird",
            },
          }),
        ),
      ).toThrow(
        'Open Graph image "missing-bird" not found in published registry',
      );
    });

    it.each([
      ["zero width", 0, 1200],
      ["zero height", 1200, 0],
      ["negative width", -100, 1200],
      ["negative height", 1200, -100],
      ["fractional width", 100.5, 600],
      ["fractional height", 600, 100.5],
      ["infinite width", Infinity, 600],
      ["infinite height", 600, Infinity],
      ["NaN width", NaN, 600],
      ["NaN height", 600, NaN],
    ])("rejects %s", (_label, width, height) => {
      expect(() =>
        resolveOpenGraphAppResolve(
          createInput({
            registryEntry: createPublishedEntry([
              {
                id: "invalid-photo",
                width,
                height,
              },
            ]),
          }),
        ),
      ).toThrow("Invalid photograph dimensions");
    });

    it("ensures extremely narrow photographs retain positive dimensions", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "extremely-narrow",
              width: 1,
              height: 100000,
            },
          ]),
        }),
      );

      expect(result.imageWidth).toBe(1);
      expect(result.imageHeight).toBe(630);
      expect(result.image).toBe(
        "https://kevinellen.com/media/photo/1/630/extremely-narrow",
      );
    });

    it("ensures extremely wide photographs retain positive dimensions", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "extremely-wide",
              width: 100000,
              height: 1,
            },
          ]),
        }),
      );

      expect(result.imageWidth).toBe(1200);
      expect(result.imageHeight).toBe(1);
    });
  });

  describe("authored image dimensions", () => {
    it("uses explicit dimensions for a dedicated bundled image", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          openGraph: {
            image: "/assets/images/social.jpg",
            width: 1200,
            height: 630,
          },
        }),
      );

      expect(result.imageWidth).toBe(1200);
      expect(result.imageHeight).toBe(630);
    });

    it.each([
      ["missing width", undefined, 630],
      ["missing height", 1200, undefined],
      ["zero width", 0, 630],
      ["zero height", 1200, 0],
      ["negative width", -1, 630],
      ["negative height", 1200, -1],
      ["fractional width", 1200.5, 630],
      ["fractional height", 1200, 630.5],
      ["infinite width", Infinity, 630],
      ["infinite height", 1200, Infinity],
      ["NaN width", NaN, 630],
      ["NaN height", 1200, NaN],
    ])("rejects %s", (_label, width, height) => {
      expect(() =>
        resolveOpenGraphAppResolve(
          createInput({
            openGraph: {
              image: "/assets/images/social.jpg",
              width,
              height,
            },
          }),
        ),
      ).toThrow("Open Graph image dimensions require valid width and height");
    });

    it("rejects authored dimensions without an explicit image", () => {
      expect(() =>
        resolveOpenGraphAppResolve(
          createInput({
            openGraph: {
              width: 1200,
              height: 630,
            },
          }),
        ),
      ).toThrow("Open Graph image dimensions require an explicit image");
    });

    it("does not require dimensions for an image-only override", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          openGraph: {
            image: "/assets/images/social.jpg",
          },
        }),
      );

      expect(result.image).not.toBeNull();
      expect(result.imageWidth).toBeNull();
      expect(result.imageHeight).toBeNull();
    });

    it("does not apply authored dimensions to an unselected fallback image", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          registryEntry: createPublishedEntry([
            {
              id: "marsh-harrier",
              width: 2837,
              height: 1891,
            },
          ]),
          openGraph: {
            title: "Marsh Harriers",
          },
        }),
      );

      expect(result.imageWidth).toBe(945);
      expect(result.imageHeight).toBe(630);
    });
  });

  describe("URL resolution", () => {
    it("resolves bundled assets against the configured canonical domain", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          canonicalDomain: "https://www.example.com",
          registryEntry: createBundledEntry(),
        }),
      );

      expect(result.image).toBe(
        "https://www.example.com/assets/images/forest.jpg",
      );
    });

    it("resolves published photographs against the configured canonical domain", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          canonicalDomain: "http://localhost:8787",
          registryEntry: createPublishedEntry([
            {
              id: "local-bird",
              width: 1200,
              height: 630,
            },
          ]),
        }),
      );

      expect(result.image).toBe(
        "http://localhost:8787/media/photo/1200/630/local-bird",
      );
    });

    it("preserves the canonical URL independently of the image domain", () => {
      const result = resolveOpenGraphAppResolve(
        createInput({
          canonicalUrl: "https://kevinellen.com/about",
          canonicalDomain: "http://localhost:8787",
          openGraph: {
            image: "/assets/images/social.jpg",
          },
        }),
      );

      expect(result.url).toBe("https://kevinellen.com/about");
      expect(result.image).toBe(
        "http://localhost:8787/assets/images/social.jpg",
      );
    });
  });

  it("converts the configured language into Open Graph locale format", () => {
    const result = resolveOpenGraphAppResolve(
      createInput({ language: "nl-NL" }),
    );

    expect(result.language).toBe("nl_NL");
  });
});
