// src/app/life-cycle/app-resolve/resolvers/registry/content/photo-extraction/photo-extraction.content.registry.resolver.app-resolve.test.ts

import { resolveContentPhotosAppResolve } from "./photo-extraction.content.registry.resolver.app-resolve";

type Body = Parameters<typeof resolveContentPhotosAppResolve>[0]["body"];
type Photo = ReturnType<typeof resolveContentPhotosAppResolve>[number];

// These tests exercise extraction against different module shapes without
// coupling the fixtures to individual authored module schemas.
const createBody = (modules: unknown[]): Body =>
  ({ modules }) as unknown as Body;

const extract = (...modules: unknown[]): readonly Photo[] =>
  resolveContentPhotosAppResolve({ body: createBody(modules) });

describe("Content registry photograph extraction", () => {
  it("returns no photographs for an empty module collection", () => {
    expect(extract()).toEqual([]);
  });

  it("ignores non-media strings and unrelated primitive values", () => {
    expect(
      extract({
        heading: "A walk through Epping Forest",
        caption: "A woodland photograph",
        count: 3,
        visible: true,
        nothing: null,
      }),
    ).toEqual([]);
  });

  it.each(["media", "image", "photo", "photos"] as const)(
    'extracts a string reference from the "%s" field',
    (key) => {
      expect(extract({ [key]: "forest-fox" })).toEqual([
        { src: "forest-fox", width: null, height: null },
      ]);
    },
  );

  it.each(["media", "image", "photo", "photos"] as const)(
    'extracts an object reference from the "%s" field',
    (key) => {
      expect(
        extract({ [key]: { src: "forest-fox", width: 6000, height: 4000 } }),
      ).toEqual([{ src: "forest-fox", width: 6000, height: 4000 }]);
    },
  );

  it("accepts an id when a media object's src is absent", () => {
    expect(
      extract({ image: { id: "forest-fox", width: 6000, height: 4000 } }),
    ).toEqual([{ src: "forest-fox", width: 6000, height: 4000 }]);
  });

  it("prefers src over id when both are present", () => {
    expect(
      extract({ image: { src: "preferred-src", id: "fallback-id" } }),
    ).toEqual([{ src: "preferred-src", width: null, height: null }]);
  });

  it("sets missing or nonnumeric dimensions to null independently", () => {
    expect(
      extract(
        { image: { src: "width-only", width: 8160 } },
        { image: { src: "height-only", height: 6144 } },
        { image: { src: "invalid-dimensions", width: "8160", height: null } },
      ),
    ).toEqual([
      { src: "width-only", width: 8160, height: null },
      { src: "height-only", width: null, height: 6144 },
      { src: "invalid-dimensions", width: null, height: null },
    ]);
  });

  it("currently preserves numeric dimensions without range or finiteness validation", () => {
    expect(
      extract(
        { image: { src: "zero", width: 0, height: -1 } },
        { image: { src: "non-finite", width: Infinity, height: NaN } },
      ),
    ).toEqual([
      { src: "zero", width: 0, height: -1 },
      { src: "non-finite", width: Infinity, height: NaN },
    ]);
  });

  it("extracts every photograph from arrays under media fields", () => {
    expect(
      extract({
        photos: [
          { image: { src: "first", width: 6000, height: 4000 } },
          { photo: { id: "second", width: 4000, height: 6000 } },
          { image: "third" },
          "unlabelled-string",
          null,
        ],
      }),
    ).toEqual([
      { src: "first", width: 6000, height: 4000 },
      { src: "second", width: 4000, height: 6000 },
      { src: "third", width: null, height: null },
    ]);
  });

  it("traverses deeply nested objects and arrays in module data", () => {
    expect(
      extract({
        sections: [
          { columns: [{ content: { image: "nested-first" } }] },
          { details: { gallery: [{ photo: { id: "nested-second" } }] } },
        ],
      }),
    ).toEqual([
      { src: "nested-first", width: null, height: null },
      { src: "nested-second", width: null, height: null },
    ]);
  });

  it("collects recognised fields in media, image, photo, photos order", () => {
    expect(
      extract({
        photos: "fourth",
        photo: "third",
        image: "second",
        media: "first",
      }),
    ).toEqual([
      { src: "first", width: null, height: null },
      { src: "second", width: null, height: null },
      { src: "third", width: null, height: null },
      { src: "fourth", width: null, height: null },
    ]);
  });

  it("deduplicates by src, retaining the last metadata and first insertion position", () => {
    expect(
      extract(
        { image: { src: "fox", width: 6000, height: 4000 } },
        { image: "owl" },
        { photo: { id: "fox", width: 8160, height: 6144 } },
      ),
    ).toEqual([
      { src: "fox", width: 8160, height: 6144 },
      { src: "owl", width: null, height: null },
    ]);
  });

  it("does not treat an ordinary src or id field as a photograph", () => {
    expect(extract({ src: "not-a-media-field", id: "not-a-photo" })).toEqual(
      [],
    );
  });

  it("ignores media objects without a string src or id", () => {
    expect(
      extract(
        { image: { src: 123, id: null, width: 6000 } },
        { photo: { width: 4000, height: 3000 } },
        { media: null },
      ),
    ).toEqual([]);
  });

  it("does not extract bare src/id objects inside photos arrays", () => {
    expect(
      extract({
        photos: [{ src: "not-detected" }, { id: "also-not-detected" }],
      }),
    ).toEqual([]);
  });

  it("does not recursively inspect unrecognised keys inside a direct media object", () => {
    expect(
      extract({
        image: {
          caption: { photo: "nested-but-not-traversed" },
        },
      }),
    ).toEqual([]);
  });

  it("does not mutate the input modules", () => {
    const modules = [
      {
        image: { src: "fox", width: 6000, height: 4000 },
        children: [{ photo: "owl" }],
      },
    ];
    const snapshot = structuredClone(modules);

    resolveContentPhotosAppResolve({ body: createBody(modules) });

    expect(modules).toEqual(snapshot);
  });

  it("returns a new photograph collection on every invocation", () => {
    const body = createBody([{ image: "forest-fox" }]);

    const first = resolveContentPhotosAppResolve({ body });
    const second = resolveContentPhotosAppResolve({ body });

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first[0]).not.toBe(second[0]);
  });
});
