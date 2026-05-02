// tests/src/rendering/utils/date.format.util.test.ts

import { formatDate } from "@utils/date.format.util";

describe("formatDate", () => {
  it("formats a valid ISO string date (date only)", () => {
    const result = formatDate("2025-05-27T10:30:00.000Z");

    // Avoid timezone brittleness — assert structure, not exact hour
    expect(result).toContain("27 May 2025");
  });

  it("formats a Date instance (date only)", () => {
    const date = new Date("2025-05-27T10:30:00.000Z");

    const result = formatDate(date);

    expect(result).toContain("27 May 2025");
  });

  it("includes time when includeTime is true", () => {
    const result = formatDate("2025-05-27T10:30:00.000Z", {
      includeTime: true,
    });

    expect(result).toContain("27 May 2025");

    // Time format will be locale-aware, so just assert presence of time
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("defaults to not including time", () => {
    const result = formatDate("2025-05-27T10:30:00.000Z");

    expect(result).toBe("27 May 2025");
  });

  it("handles different valid string formats", () => {
    const result = formatDate("2025-05-27");

    expect(result).toBe("27 May 2025");
  });

  it("throws for invalid date string", () => {
    expect(() => formatDate("not-a-date")).toThrow(
      'Invalid date value: "not-a-date"',
    );
  });

  it("throws for invalid Date instance", () => {
    const invalidDate = new Date("invalid");

    expect(() => formatDate(invalidDate)).toThrow(
      'Invalid date value: "Invalid Date"',
    );
  });

  it("handles edge case: epoch date", () => {
    const result = formatDate("1970-01-01T00:00:00.000Z");

    expect(result).toContain("1 January 1970");
  });
});
