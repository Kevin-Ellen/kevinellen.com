// packages/content-cli/src/utils/format.local.date.time.with.offset.util.test.ts

import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

describe("formatLocalDateTimeWithOffset sign coverage", () => {
  it("covers negative offset branch", () => {
    // Fake Date with getTimezoneOffset returning positive number → offsetMinutes negative → sign "-"
    const fakeDate = {
      getFullYear: () => 2026,
      getMonth: () => 4,
      getDate: () => 9,
      getHours: () => 12,
      getMinutes: () => 0,
      getSeconds: () => 0,
      getTimezoneOffset: () => 330, // +5:30 → offsetMinutes = -330 → sign "-"
    } as unknown as Date;

    const formatted = formatLocalDateTimeWithOffset(fakeDate);

    expect(formatted.endsWith("-05:30")).toBe(true);
  });

  it("covers positive offset branch", () => {
    // Fake Date with getTimezoneOffset returning negative number → offsetMinutes positive → sign "+"
    const fakeDate = {
      getFullYear: () => 2026,
      getMonth: () => 4,
      getDate: () => 9,
      getHours: () => 12,
      getMinutes: () => 0,
      getSeconds: () => 0,
      getTimezoneOffset: () => -120, // -2:00 → offsetMinutes = +120 → sign "+"
    } as unknown as Date;

    const formatted = formatLocalDateTimeWithOffset(fakeDate);

    expect(formatted.endsWith("+02:00")).toBe(true);
  });
});
