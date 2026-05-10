// packages/content-cli/src/content/photo/render.photo.content.test.ts

import { renderPhotoDraftFile } from "@content-cli/content/photo/render.photo.content";

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

const basePhoto: AuthoredPhotoMetadata = {
  id: "robin-close-up",
  sourceFileName: "robin-close-up.jpg",

  cloudflareImageId: null,
  cloudflareUploadedAt: null,

  title: "Robin Close Up",
  alt: "Robin perched on a branch",
  commentary: "A robin in soft morning light",
  readableLocation: "Epping Forest",

  capturedAt: {
    utc: "2026-05-10T12:00:00.000Z",
    timezone: "Europe/London",
  },

  photographer: "Kevin Ellen",
  copyright: "Kevin Ellen",

  cameraMake: "Canon",
  cameraModel: "EOS R7",
  lensModel: "RF100-500mm",

  exposureTime: 0.001,
  aperture: 7.1,
  iso: 800,

  focalLength: 500,
  focalLength35mm: 800,

  width: 1000,
  height: 800,

  latitude: 51.6,
  longitude: 0.0,

  resolvedLocation: {
    name: "Epping Forest",
    road: null,
    village: null,
    town: "Epping",
    city: null,
    county: "Essex",
    state: "England",
    country: "United Kingdom",
    countryCode: "gb",
    postcode: null,
    displayName: "Epping Forest, Essex, England",
  },
};

describe("renderPhotoDraftFile", () => {
  it("renders a complete photo draft file", () => {
    const result = renderPhotoDraftFile(basePhoto);

    expect(result).toContain('id: "robin-close-up"');

    expect(result).toContain('sourceFileName: "robin-close-up.jpg"');

    expect(result).toContain('title: "Robin Close Up"');

    expect(result).toContain("capturedAt: {");

    expect(result).toContain('utc: "2026-05-10T12:00:00.000Z"');

    expect(result).toContain('timezone: "Europe/London"');

    expect(result).toContain("resolvedLocation: {");

    expect(result).toContain('displayName: "Epping Forest, Essex, England"');

    expect(result).toContain("} satisfies AuthoredPhotoMetadata;");
  });

  it("renders null values correctly", () => {
    const result = renderPhotoDraftFile({
      ...basePhoto,
      capturedAt: null,
      resolvedLocation: null,
      cloudflareImageId: null,
      latitude: null,
      longitude: null,
    });

    expect(result).toContain("capturedAt: null");

    expect(result).toContain("resolvedLocation: null");

    expect(result).toContain("cloudflareImageId: null");

    expect(result).toContain("latitude: null");

    expect(result).toContain("longitude: null");
  });

  it("renders nullable timezone correctly", () => {
    const result = renderPhotoDraftFile({
      ...basePhoto,
      capturedAt: {
        utc: "2026-05-10T12:00:00.000Z",
        timezone: null,
      },
    });

    expect(result).toContain("timezone: null");
  });
});
