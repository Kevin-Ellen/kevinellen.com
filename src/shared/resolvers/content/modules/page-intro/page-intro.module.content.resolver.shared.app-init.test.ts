// src/shared/resolvers/content/modules/page-intro/page-intro.module.content.resolver.shared.app-init.test.ts

import { resolvePageIntroModuleContentAppInit } from "./page-intro.module.content.resolver.shared.app-init";

type Input = Parameters<typeof resolvePageIntroModuleContentAppInit>[0];
type Authored = Input["authored"];

describe("Page intro module AppInit resolver", () => {
  const dates = {
    created: "2026-10-15",
  } as unknown as Input["dates"];

  const createAuthored = (overrides: Partial<Authored> = {}): Authored =>
    ({
      kind: "pageIntro",
      title: "Field notes from Epping Forest",
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored, resolvedDates: Input["dates"] = dates) =>
    resolvePageIntroModuleContentAppInit({
      authored,
      dates: resolvedDates,
    });

  describe("Optional properties", () => {
    it("normalises omitted properties to null", () => {
      const result = resolve(createAuthored());

      expect(result.eyebrow).toBeNull();
      expect(result.description).toBeNull();
      expect(result.location).toBeNull();
    });

    it("normalises explicitly undefined properties to null", () => {
      const result = resolve(
        createAuthored({
          eyebrow: undefined,
          description: undefined,
          location: undefined,
        }),
      );

      expect(result.eyebrow).toBeNull();
      expect(result.description).toBeNull();
      expect(result.location).toBeNull();
    });

    it("preserves an authored eyebrow", () => {
      const result = resolve(
        createAuthored({
          eyebrow: "Journal",
        }),
      );

      expect(result.eyebrow).toBe("Journal");
    });

    it("preserves an authored description", () => {
      const description = "An autumn morning in the forest.";

      const result = resolve(createAuthored({ description }));

      expect(result.description).toBe(description);
    });

    it("preserves an authored location", () => {
      const location = "Epping Forest, Essex";

      const result = resolve(createAuthored({ location }));

      expect(result.location).toBe(location);
    });

    it("preserves all optional properties together", () => {
      const result = resolve(
        createAuthored({
          eyebrow: "Field notes",
          description: "An encounter with wildlife",
          location: "Loughton, Essex",
        }),
      );

      expect(result).toMatchObject({
        eyebrow: "Field notes",
        description: "An encounter with wildlife",
        location: "Loughton, Essex",
      });
    });
  });

  describe("Date resolution", () => {
    it("uses the resolved created date", () => {
      const result = resolve(createAuthored());

      expect(result.date).toBe(dates.created);
    });

    it("overrides any authored date with the resolved date", () => {
      const authored = {
        ...createAuthored(),
        date: "2000-01-01",
      };

      const result = resolve(authored);

      expect(result.date).toBe(dates.created);
    });

    it("uses the date supplied for each invocation", () => {
      const firstDates = {
        created: "2026-01-01",
      } as unknown as Input["dates"];

      const secondDates = {
        created: "2026-11-04",
      } as unknown as Input["dates"];

      const authored = createAuthored();

      const first = resolve(authored, firstDates);
      const second = resolve(authored, secondDates);

      expect(first.date).toBe(firstDates.created);
      expect(second.date).toBe(secondDates.created);
    });
  });

  describe("Data integrity", () => {
    it("preserves unrelated authored properties", () => {
      const authored = createAuthored();

      const result = resolve(authored);

      expect(result).toMatchObject({
        kind: "pageIntro",
        title: "Field notes from Epping Forest",
      });
    });

    it("does not mutate the authored module", () => {
      const authored = createAuthored({
        eyebrow: "Journal",
      });

      const original = { ...authored };

      resolve(authored);

      expect(authored).toEqual(original);
    });

    it("does not mutate the dates object", () => {
      const original = { ...dates };

      resolve(createAuthored());

      expect(dates).toEqual(original);
    });

    it("returns a new module object", () => {
      const authored = createAuthored();

      const result = resolve(authored);

      expect(result).not.toBe(authored);
    });

    it("returns a fresh object on repeated resolution", () => {
      const authored = createAuthored();

      const first = resolve(authored);
      const second = resolve(authored);

      expect(first).toEqual(second);
      expect(first).not.toBe(second);
    });
  });
});
