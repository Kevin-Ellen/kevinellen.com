// src/utils/normaliseDimensions.util.test.ts

import {
  normaliseDimensionsToBase,
  resolveSvgReferenceDimensions,
} from "./normaliseDimensions.util";

describe("normaliseDimensionsToBase", () => {
  it("normalises landscape dimensions", () => {
    expect(normaliseDimensionsToBase(200, 100)).toEqual({
      width: 100,
      height: 50,
    });
  });

  it("normalises portrait dimensions", () => {
    expect(normaliseDimensionsToBase(100, 200)).toEqual({
      width: 50,
      height: 100,
    });
  });

  it("normalises square dimensions", () => {
    expect(normaliseDimensionsToBase(100, 100)).toEqual({
      width: 100,
      height: 100,
    });
  });

  it("supports custom base sizes", () => {
    expect(normaliseDimensionsToBase(400, 200, 200)).toEqual({
      width: 200,
      height: 100,
    });
  });

  it("throws for non-finite width values", () => {
    expect(() => normaliseDimensionsToBase(Number.NaN, 100)).toThrow(
      "Dimensions must be finite numbers.",
    );
  });

  it("throws for non-finite height values", () => {
    expect(() => normaliseDimensionsToBase(100, Infinity)).toThrow(
      "Dimensions must be finite numbers.",
    );
  });

  it("throws when width is zero or below", () => {
    expect(() => normaliseDimensionsToBase(0, 100)).toThrow(
      "Dimensions must be greater than zero.",
    );
  });

  it("throws when height is zero or below", () => {
    expect(() => normaliseDimensionsToBase(100, -1)).toThrow(
      "Dimensions must be greater than zero.",
    );
  });
});

describe("resolveSvgReferenceDimensions", () => {
  it("resolves landscape SVG dimensions", () => {
    expect(resolveSvgReferenceDimensions("0 0 24 12")).toEqual({
      width: 100,
      height: 50,
    });
  });

  it("resolves portrait SVG dimensions", () => {
    expect(resolveSvgReferenceDimensions("0 0 12 24")).toEqual({
      width: 50,
      height: 100,
    });
  });

  it("supports custom base sizes", () => {
    expect(resolveSvgReferenceDimensions("0 0 24 12", 200)).toEqual({
      width: 200,
      height: 100,
    });
  });

  it("throws for invalid SVG viewBox structures", () => {
    expect(() => resolveSvgReferenceDimensions("0 0 24")).toThrow(
      'Invalid SVG viewBox: "0 0 24"',
    );
  });

  it("throws for NaN SVG viewBox values", () => {
    expect(() => resolveSvgReferenceDimensions("0 0 nope 24")).toThrow(
      'Invalid SVG viewBox: "0 0 nope 24"',
    );
  });

  it("throws for zero width SVG dimensions", () => {
    expect(() => resolveSvgReferenceDimensions("0 0 0 24")).toThrow(
      'Invalid SVG dimensions in viewBox: "0 0 0 24"',
    );
  });

  it("throws for zero height SVG dimensions", () => {
    expect(() => resolveSvgReferenceDimensions("0 0 24 0")).toThrow(
      'Invalid SVG dimensions in viewBox: "0 0 24 0"',
    );
  });
});
