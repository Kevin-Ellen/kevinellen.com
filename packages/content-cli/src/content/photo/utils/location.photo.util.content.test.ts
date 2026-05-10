// packages/content-cli/src/content/photo/utils/location.photo.util.content.test.ts

import { resolvePhotoLocation } from "@content-cli/content/photo/utils/location.photo.util.content";

describe("resolvePhotoLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("returns null when latitude is missing", async () => {
    await expect(resolvePhotoLocation(null, 0)).resolves.toBeNull();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns null when longitude is missing", async () => {
    await expect(resolvePhotoLocation(51.5, null)).resolves.toBeNull();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("resolves a photo location from Nominatim", async () => {
    jest.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        name: "Rye House",
        display_name: "Rye House, Hertfordshire, England",
        address: {
          road: "Rye Road",
          village: "Rye",
          town: "Hoddesdon",
          city: "London",
          county: "Hertfordshire",
          state: "England",
          country: "United Kingdom",
          country_code: "gb",
          postcode: "EN11",
        },
      }),
    } as Response);

    const result = await resolvePhotoLocation(51.77, -0.01);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://nominatim.openstreetmap.org/reverse"),
      {
        headers: {
          "User-Agent": "KevinEllenContentCLI/1.0",
          Accept: "application/json",
        },
      },
    );

    const calledUrl = new URL(
      jest.mocked(global.fetch).mock.calls[0][0] as string,
    );

    expect(calledUrl.searchParams.get("format")).toBe("jsonv2");
    expect(calledUrl.searchParams.get("lat")).toBe("51.77");
    expect(calledUrl.searchParams.get("lon")).toBe("-0.01");
    expect(calledUrl.searchParams.get("zoom")).toBe("18");
    expect(calledUrl.searchParams.get("addressdetails")).toBe("1");

    expect(result).toEqual({
      name: "Rye House",
      road: "Rye Road",
      village: "Rye",
      town: "Hoddesdon",
      city: "London",
      county: "Hertfordshire",
      state: "England",
      country: "United Kingdom",
      countryCode: "gb",
      postcode: "EN11",
      displayName: "Rye House, Hertfordshire, England",
    });
  });

  it("normalises missing response fields to null", async () => {
    jest.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    await expect(resolvePhotoLocation(51.77, -0.01)).resolves.toEqual({
      name: null,
      road: null,
      village: null,
      town: null,
      city: null,
      county: null,
      state: null,
      country: null,
      countryCode: null,
      postcode: null,
      displayName: null,
    });
  });

  it("throws when Nominatim responds with a non-ok status", async () => {
    jest.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    await expect(resolvePhotoLocation(51.77, -0.01)).rejects.toThrow(
      "Failed to resolve photo location (429)",
    );
  });
});
