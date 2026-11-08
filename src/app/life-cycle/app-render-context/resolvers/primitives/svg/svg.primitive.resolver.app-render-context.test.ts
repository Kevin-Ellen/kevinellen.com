// src/app/life-cycle/app-render-context/resolvers/primitives/svg/svg.primitive.resolver.app-render-context.test.ts

import { resolveSvgReferenceAppRenderContext } from "./svg.primitive.resolver.app-render-context";

type Reference = Parameters<
  typeof resolveSvgReferenceAppRenderContext
>[0]["reference"];

describe("SVG primitive AppRenderContext resolver", () => {
  const createReference = (): Reference =>
    ({
      id: "icon-camera",
    }) as Reference;

  it("preserves SVG reference properties", () => {
    const reference = createReference();

    expect(resolveSvgReferenceAppRenderContext({ reference })).toEqual(
      reference,
    );
  });

  it("returns a new object reference", () => {
    const reference = createReference();

    const result = resolveSvgReferenceAppRenderContext({
      reference,
    });

    expect(result).not.toBe(reference);
  });

  it("preserves individual property references", () => {
    const reference = createReference();

    const result = resolveSvgReferenceAppRenderContext({
      reference,
    });

    expect(result.id).toBe(reference.id);
  });

  it("does not mutate frozen input", () => {
    const reference = Object.freeze(createReference());

    expect(resolveSvgReferenceAppRenderContext({ reference })).toEqual(
      reference,
    );
  });
});
