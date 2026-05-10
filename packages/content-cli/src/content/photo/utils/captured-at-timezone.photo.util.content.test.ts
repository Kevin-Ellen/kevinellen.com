// packages/content-cli/src/content/photo/utils/captured-at-timezone.photo.util.content.test.ts

import { enrichPhotoCapturedAtTimezone } from "@content-cli/content/photo/utils/captured-at-timezone.photo.util.content";
import tzLookup from "tz-lookup";

jest.mock("tz-lookup");

describe("enrichPhotoCapturedAtTimezone", () => {
  const mockTzLookup = jest.mocked(tzLookup);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns photo as-is if capturedAt is missing", () => {
    const photo = { id: "1", capturedAt: null } as any;
    expect(enrichPhotoCapturedAtTimezone(photo)).toBe(photo);
  });

  it("returns photo as-is if capturedAt.timezone already exists", () => {
    const photo = {
      id: "2",
      capturedAt: {
        datetime: "2026-05-10T12:00:00Z",
        timezone: "Europe/London",
      },
    } as any;
    expect(enrichPhotoCapturedAtTimezone(photo)).toBe(photo);
  });

  it("sets timezone to null if latitude or longitude are missing", () => {
    const photo = {
      id: "3",
      capturedAt: { datetime: "2026-05-10T12:00:00Z" },
      latitude: null,
      longitude: 0,
    } as any;

    const result = enrichPhotoCapturedAtTimezone(photo);
    expect(result.capturedAt!.timezone).toBeNull(); // <-- use !
  });

  it("enriches photo with tz-lookup if lat/lon are present", () => {
    const photo = {
      id: "4",
      capturedAt: { datetime: "2026-05-10T12:00:00Z" },
      latitude: 51.5074,
      longitude: -0.1278,
    } as any;

    mockTzLookup.mockReturnValue("Europe/London");

    const result = enrichPhotoCapturedAtTimezone(photo);
    expect(result.capturedAt!.timezone).toBe("Europe/London"); // <-- use !
    expect(mockTzLookup).toHaveBeenCalledWith(51.5074, -0.1278);
  });
});
