// src/shared/resolvers/content/modules/editorial-intro/editorial-intro.module.content.resolver.shared.app-init.test.ts

import type { EditorialIntroModuleContentAuthored } from "../../../../../content-schema/content/modules/editorial-intro.module.content.content-schema.authored.type";

import { resolveEditorialIntroModuleContentAppInit } from "./editorial-intro.module.content.resolver.shared.app-init";

type Authored = EditorialIntroModuleContentAuthored;

describe("Editorial intro module AppInit resolver", () => {
  const createAuthored = (overrides: Partial<Authored> = {}): Authored => ({
    kind: "editorialIntro",
    eyebrow: "About",
    title: "Wildlife photography",
    statement: "Observing nature through photography.",
    description: "Field notes and encounters from Essex and beyond.",
    ...overrides,
  });

  const resolve = (authored: Authored) =>
    resolveEditorialIntroModuleContentAppInit({ authored });

  it("normalises undefined location and portrait to null", () => {
    const result = resolve(createAuthored());

    expect(result.location).toBeNull();
    expect(result.portrait).toBeNull();
  });

  it("normalises explicitly undefined location and portrait to null", () => {
    const result = resolve(
      createAuthored({
        location: undefined,
        portrait: undefined,
      }),
    );

    expect(result.location).toBeNull();
    expect(result.portrait).toBeNull();
  });

  it("preserves an authored location", () => {
    const location = {
      name: "Epping Forest",
    } as unknown as NonNullable<Authored["location"]>;

    const result = resolve(createAuthored({ location }));

    expect(result.location).toBe(location);
  });

  it("preserves an authored portrait", () => {
    const portrait = {
      id: "portrait",
      src: "/images/portrait.jpg",
    } as unknown as NonNullable<Authored["portrait"]>;

    const result = resolve(createAuthored({ portrait }));

    expect(result.portrait).toBe(portrait);
  });

  it("preserves both location and portrait simultaneously", () => {
    const location = {
      name: "Loughton, Essex",
    } as unknown as NonNullable<Authored["location"]>;

    const portrait = {
      src: "/images/portrait.jpg",
    } as unknown as NonNullable<Authored["portrait"]>;

    const result = resolve(
      createAuthored({
        location,
        portrait,
      }),
    );

    expect(result.location).toBe(location);
    expect(result.portrait).toBe(portrait);
  });

  it("preserves unrelated authored properties", () => {
    const authored = {
      ...createAuthored(),
      heading: "About the photographer",
      introduction: "Wildlife photography in Essex",
    };

    const result = resolve(authored);

    expect(result).toMatchObject({
      heading: "About the photographer",
      introduction: "Wildlife photography in Essex",
    });
  });

  it("does not mutate the authored module", () => {
    const authored = createAuthored({
      location: undefined,
      portrait: undefined,
    });

    const original = { ...authored };

    resolve(authored);

    expect(authored).toEqual(original);
  });

  it("returns a new module object", () => {
    const authored = createAuthored();

    const result = resolve(authored);

    expect(result).not.toBe(authored);
  });

  it("returns a fresh module object on repeated resolution", () => {
    const authored = createAuthored();

    const first = resolve(authored);
    const second = resolve(authored);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });

  it("supports frozen authored modules", () => {
    const authored = Object.freeze(createAuthored());

    const result = resolve(authored);

    expect(result.location).toBeNull();
    expect(result.portrait).toBeNull();
    expect(result).not.toBe(authored);
  });
});
