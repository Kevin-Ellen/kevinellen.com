// src/utils/date.format.util.test.ts

import { formatDate } from "./date.format.util";

describe("formatDate", () => {
  it("formats ISO date strings without time by default", () => {
    expect(formatDate("2025-05-10T14:30:00.000Z")).toBe("10 May 2025");
  });

  it("formats Date instances", () => {
    expect(formatDate(new Date("2025-12-25T00:00:00.000Z"))).toBe(
      "25 December 2025",
    );
  });

  it("formats dates including time when requested", () => {
    const result = formatDate("2025-05-10T14:30:00.000Z", {
      includeTime: true,
    });

    expect(result).toContain("10 May 2025");
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it("formats using provided timezone", () => {
    expect(
      formatDate("2025-05-10T14:30:00.000Z", {
        includeTime: true,
        timeZone: "Europe/Madrid",
      }),
    ).toBe("10 May 2025, 16:30");
  });

  it("does not include time when includeTime is false, even with timezone", () => {
    expect(
      formatDate("2025-05-10T14:30:00.000Z", {
        includeTime: false,
        timeZone: "Asia/Bangkok",
      }),
    ).toBe("10 May 2025");
  });

  it("throws for invalid string dates", () => {
    expect(() => formatDate("absolutely-not-a-date")).toThrow(
      'Invalid date value: "absolutely-not-a-date"',
    );
  });

  it("throws for invalid Date instances", () => {
    expect(() => formatDate(new Date("invalid"))).toThrow(
      'Invalid date value: "Invalid Date"',
    );
  });
});
