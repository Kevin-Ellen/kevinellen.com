// tests/src/utils/normaliseDimensions.util.test.ts

import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";

describe("normaliseDimensionsToBase", () => {
  it("normalises landscape dimensions (ratio >= 1)", () => {
    const result = normaliseDimensionsToBase(200, 100);

    expect(result).toEqual({
      width: 100,
      height: 50,
    });
  });

  it("normalises portrait dimensions (ratio < 1)", () => {
    const result = normaliseDimensionsToBase(100, 200);

    expect(result).toEqual({
      width: 50,
      height: 100,
    });
  });

  it("handles square dimensions correctly", () => {
    const result = normaliseDimensionsToBase(100, 100);

    expect(result).toEqual({
      width: 100,
      height: 100,
    });
  });

  it("respects a custom base size", () => {
    const result = normaliseDimensionsToBase(200, 100, 200);

    expect(result).toEqual({
      width: 200,
      height: 100,
    });
  });

  it("rounds values correctly for non-integer results (landscape)", () => {
    const result = normaliseDimensionsToBase(300, 200); // ratio = 1.5

    expect(result).toEqual({
      width: 100,
      height: Math.round(100 / 1.5),
    });
  });

  it("rounds values correctly for non-integer results (portrait)", () => {
    const result = normaliseDimensionsToBase(200, 300); // ratio ≈ 0.666

    expect(result).toEqual({
      width: Math.round(100 * (200 / 300)),
      height: 100,
    });
  });

  it("throws when width is not finite", () => {
    expect(() => normaliseDimensionsToBase(Infinity, 100)).toThrow(
      "Dimensions must be finite numbers.",
    );
  });

  it("throws when height is not finite", () => {
    expect(() => normaliseDimensionsToBase(100, NaN)).toThrow(
      "Dimensions must be finite numbers.",
    );
  });

  it("throws when width is zero or negative", () => {
    expect(() => normaliseDimensionsToBase(0, 100)).toThrow(
      "Dimensions must be greater than zero.",
    );

    expect(() => normaliseDimensionsToBase(-100, 100)).toThrow(
      "Dimensions must be greater than zero.",
    );
  });

  it("throws when height is zero or negative", () => {
    expect(() => normaliseDimensionsToBase(100, 0)).toThrow(
      "Dimensions must be greater than zero.",
    );

    expect(() => normaliseDimensionsToBase(100, -100)).toThrow(
      "Dimensions must be greater than zero.",
    );
  });
});
