// src/app/life-cycle/app-resolve/resolvers/primitives/svg/svg.primitive.resolver.app-resolve.test.ts

import { resolveSvgReferenceAppResolve } from "./svg.primitive.resolver.app-resolve";

type Reference = Parameters<
  typeof resolveSvgReferenceAppResolve
>[0]["reference"];

describe("SVG primitive AppResolve resolver", () => {
  const createReference = (overrides: Partial<Reference> = {}): Reference =>
    ({
      id: "camera",
      ...overrides,
    }) as Reference;

  it("preserves the SVG reference properties", () => {
    const reference = createReference();

    expect(resolveSvgReferenceAppResolve({ reference })).toEqual(reference);
  });

  it("returns a new reference object", () => {
    const reference = createReference();

    const result = resolveSvgReferenceAppResolve({
      reference,
    });

    expect(result).not.toBe(reference);
  });

  it("does not mutate the original reference", () => {
    const reference = Object.freeze(createReference());

    const result = resolveSvgReferenceAppResolve({
      reference,
    });

    expect(result).toEqual(reference);
    expect(reference.id).toBe("camera");
  });
});
