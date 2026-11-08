// src/tools/authored-content-generator/prepare/photo/location/location.photo.prepare.test.ts

import tzLookup from "tz-lookup";

import {
  resolvePhotoLocation,
  resolvePhotoTimezone,
} from "./location.photo.prepare";

jest.mock("tz-lookup", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedTzLookup = jest.mocked(tzLookup);

describe("Photo location preparation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedTzLookup.mockReturnValue("Europe/London");
  });

  describe("Timezone resolution", () => {
    it("resolves timezone from coordinates", () => {
      expect(resolvePhotoTimezone(51.65, 0.06)).toBe("Europe/London");

      expect(mockedTzLookup).toHaveBeenCalledWith(51.65, 0.06);
    });

    it("returns the timezone provided by tz-lookup", () => {
      mockedTzLookup.mockReturnValue("Europe/Tallinn");

      expect(resolvePhotoTimezone(59.4, 24.7)).toBe("Europe/Tallinn");
    });

    it.each([
      [null, 0],
      [0, null],
      [null, null],
    ])("returns null for missing coordinates %s, %s", (latitude, longitude) => {
      expect(resolvePhotoTimezone(latitude, longitude)).toBeNull();

      expect(mockedTzLookup).not.toHaveBeenCalled();
    });

    it.each([
      [-90, -180],
      [90, 180],
      [0, 0],
    ])("accepts boundary coordinates %s, %s", (latitude, longitude) => {
      expect(resolvePhotoTimezone(latitude, longitude)).toBe("Europe/London");

      expect(mockedTzLookup).toHaveBeenCalledWith(latitude, longitude);
    });

    it.each([
      [-90.001, 0],
      [90.001, 0],
      [0, -180.001],
      [0, 180.001],
    ])("rejects invalid coordinates %s, %s", (latitude, longitude) => {
      expect(() => resolvePhotoTimezone(latitude, longitude)).toThrow(
        "Invalid photo GPS coordinates",
      );

      expect(mockedTzLookup).not.toHaveBeenCalled();
    });

    it("propagates timezone lookup failures", () => {
      const error = new Error("Timezone lookup failed");

      mockedTzLookup.mockImplementation(() => {
        throw error;
      });

      expect(() => resolvePhotoTimezone(51.65, 0.06)).toThrow(error);
    });
  });

  describe("Reverse geocoding", () => {
    let fetchSpy: jest.SpiedFunction<typeof fetch>;

    const createResponse = (data: unknown, status = 200): Response =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      });

    const resolveLocation = async (latitude: number, longitude: number) => {
      const pending = resolvePhotoLocation(latitude, longitude);

      await jest.advanceTimersByTimeAsync(1100);

      return pending;
    };

    beforeEach(() => {
      jest.useFakeTimers();

      fetchSpy = jest.spyOn(globalThis, "fetch");

      fetchSpy.mockImplementation(async () =>
        createResponse({
          name: "Epping Forest",
          display_name: "Epping Forest, Essex, England",
          address: {
            road: "Forest Road",
            village: "Loughton",
            town: "Loughton",
            city: "London",
            county: "Essex",
            state: "England",
            country: "United Kingdom",
            country_code: "gb",
            postcode: "IG10",
          },
        }),
      );
    });

    afterEach(() => {
      fetchSpy.mockRestore();
      jest.useRealTimers();
    });

    it.each([
      [null, 0],
      [0, null],
      [null, null],
    ])(
      "returns null for missing coordinates %s, %s",
      async (latitude, longitude) => {
        await expect(
          resolvePhotoLocation(latitude, longitude),
        ).resolves.toBeNull();

        expect(fetchSpy).not.toHaveBeenCalled();
      },
    );

    it.each([
      [-90.001, 0],
      [90.001, 0],
      [0, -180.001],
      [0, 180.001],
    ])("rejects invalid coordinates %s, %s", async (latitude, longitude) => {
      await expect(resolvePhotoLocation(latitude, longitude)).rejects.toThrow(
        "Invalid photo GPS coordinates",
      );

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("sends the expected Nominatim request", async () => {
      await resolveLocation(51.501001, -0.141001);

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      const [input, init] = fetchSpy.mock.calls[0];

      expect(input).toBeInstanceOf(URL);

      const url = new URL(String(input));

      expect(url.origin).toBe("https://nominatim.openstreetmap.org");
      expect(url.pathname).toBe("/reverse");

      expect(Object.fromEntries(url.searchParams)).toEqual({
        format: "jsonv2",
        lat: "51.501001",
        lon: "-0.141001",
        zoom: "18",
        addressdetails: "1",
      });

      expect(init).toEqual({
        headers: {
          "User-Agent": "KevinEllenContentGenerator/1.0",
          Accept: "application/json",
        },
      });
    });

    it("maps all Nominatim address fields", async () => {
      const result = await resolveLocation(51.501002, -0.141002);

      expect(result).toEqual({
        name: "Epping Forest",
        road: "Forest Road",
        village: "Loughton",
        town: "Loughton",
        city: "London",
        county: "Essex",
        state: "England",
        country: "United Kingdom",
        countryCode: "gb",
        postcode: "IG10",
        displayName: "Epping Forest, Essex, England",
      });
    });

    it("defaults missing response fields to null", async () => {
      fetchSpy.mockResolvedValue(createResponse({}));

      const result = await resolveLocation(51.501003, -0.141003);

      expect(result).toEqual({
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

    it("defaults missing address fields to null", async () => {
      fetchSpy.mockResolvedValue(
        createResponse({
          name: "Viru Bog",
          display_name: "Viru Bog, Estonia",
          address: {
            country: "Estonia",
            country_code: "ee",
          },
        }),
      );

      const result = await resolveLocation(59.501004, 25.501004);

      expect(result).toMatchObject({
        name: "Viru Bog",
        road: null,
        village: null,
        town: null,
        city: null,
        county: null,
        state: null,
        country: "Estonia",
        countryCode: "ee",
        postcode: null,
        displayName: "Viru Bog, Estonia",
      });
    });

    it("throws when Nominatim returns an error", async () => {
      fetchSpy.mockResolvedValue(
        createResponse({ error: "Service unavailable" }, 503),
      );

      await expect(resolvePhotoLocation(51.501005, -0.141005)).rejects.toThrow(
        "Failed to resolve photo location (503)",
      );
    });

    it("propagates network failures", async () => {
      const error = new Error("Network unavailable");

      fetchSpy.mockRejectedValue(error);

      await expect(resolvePhotoLocation(51.501006, -0.141006)).rejects.toBe(
        error,
      );
    });

    it("propagates invalid JSON responses", async () => {
      fetchSpy.mockResolvedValue(
        new Response("invalid json", {
          status: 200,
        }),
      );

      await expect(
        resolvePhotoLocation(51.501007, -0.141007),
      ).rejects.toThrow();
    });

    it("caches successfully resolved locations", async () => {
      const first = await resolveLocation(51.501008, -0.141008);

      const second = await resolvePhotoLocation(51.501008, -0.141008);

      expect(second).toBe(first);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("uses six decimal places for cache keys", async () => {
      const first = await resolveLocation(51.5010091, -0.1410091);

      const second = await resolvePhotoLocation(51.5010093, -0.1410093);

      expect(second).toBe(first);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("uses different cache keys for distinct coordinates", async () => {
      const first = await resolveLocation(51.50101, -0.14101);

      const second = await resolveLocation(51.501011, -0.141011);

      expect(first).not.toBe(second);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("does not cache unsuccessful responses", async () => {
      fetchSpy.mockResolvedValueOnce(
        createResponse({ error: "Unavailable" }, 500),
      );

      await expect(resolvePhotoLocation(51.501012, -0.141012)).rejects.toThrow(
        "Failed to resolve photo location (500)",
      );

      const result = await resolveLocation(51.501012, -0.141012);

      expect(result?.name).toBe("Epping Forest");
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("rate-limits successful requests by 1100ms", async () => {
      let completed = false;

      const pending = resolvePhotoLocation(51.501013, -0.141013).then(
        (result) => {
          completed = true;
          return result;
        },
      );

      await jest.advanceTimersByTimeAsync(1099);

      expect(completed).toBe(false);

      await jest.advanceTimersByTimeAsync(1);

      const result = await pending;

      expect(completed).toBe(true);
      expect(result?.name).toBe("Epping Forest");
    });

    it("returns cached entries without additional delay", async () => {
      await resolveLocation(51.501014, -0.141014);

      const fetchCalls = fetchSpy.mock.calls.length;

      const result = await resolvePhotoLocation(51.501014, -0.141014);

      expect(result?.name).toBe("Epping Forest");
      expect(fetchSpy).toHaveBeenCalledTimes(fetchCalls);

      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
