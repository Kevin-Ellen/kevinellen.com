// src/app-render-context/resolve/media/photo.resolve.app-render-context.test.ts

import type { AppStateMetadataLabels } from "@shared-types/config/metadata-labels/app-state.metadata-labels.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";
import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

jest.mock("@utils/normaliseDimensions.util", () => ({
  normaliseDimensionsToBase: jest.fn(),
}));

const createMetadataLabels = (): AppStateMetadataLabels =>
  ({
    location: {
      label: "Location",
      description: "Where the photo was taken.",
    },
    capturedAt: {
      label: "Captured",
      description: "When the photo was taken.",
    },
    shutterSpeed: {
      label: "Shutter speed",
      description: "Exposure duration.",
    },
    aperture: {
      label: "Aperture",
      description: "Lens aperture.",
    },
    focalLength: {
      label: "Focal length",
      description: "Lens focal length.",
    },
    iso: {
      label: "ISO",
      description: "Sensor sensitivity.",
    },
  }) as AppStateMetadataLabels;

const createPhoto = (
  overrides: Partial<AppContextPhotoMetadata> = {},
): AppContextPhotoMetadata =>
  ({
    id: "coot-in-soft-light",
    title: "Coot in soft light",
    alt: "A coot swimming through soft light.",
    commentary: "ARC commentary.",
    readableLocation: "Epping Forest, Essex",
    capturedAt: {
      utc: "2026-05-09T08:00:00.000Z",
      timezone: "Europe/London",
    },
    width: 1600,
    height: 1000,
    src: null,
    srcset: null,
    sizes: null,
    attribution: null,
    ratio: null,
    cloudflareImageId: "raw-cloudflare-id",
    cloudflareUploadedAt: "2026-05-09T09:00:00.000Z",
    photographer: "Kevin Ellen",
    copyright: null,
    latitude: 51.7,
    longitude: 0.1,
    resolvedLocation: {
      country: "England",
    },
    cameraMake: "Canon",
    cameraModel: "EOS R7",
    lensModel: "RF 100-500mm",
    exposureTime: 0.00125,
    aperture: 7.1,
    focalLength: 500,
    iso: 12800,
    ...overrides,
  }) as unknown as AppContextPhotoMetadata;

describe("appRenderContextResolvePhoto", () => {
  const mockedFormatDate = jest.mocked(formatDate);
  const mockedNormaliseDimensionsToBase = jest.mocked(
    normaliseDimensionsToBase,
  );

  beforeEach(() => {
    jest.clearAllMocks();

    mockedFormatDate.mockReturnValue("9 May 2026");
    mockedNormaliseDimensionsToBase.mockReturnValue({
      width: 8,
      height: 5,
    });
  });

  it("resolves a render-safe photo shape", () => {
    const result = appRenderContextResolvePhoto(
      createPhoto(),
      createMetadataLabels(),
    );

    expect(result).toEqual({
      id: "coot-in-soft-light",
      title: "Coot in soft light",
      alt: "A coot swimming through soft light.",
      commentary: "ARC commentary.",
      width: 1600,
      height: 1000,
      src: "/media/photo/coot-in-soft-light",
      srcset: [
        "/media/photo/coot-in-soft-light/640/400 640w",
        "/media/photo/coot-in-soft-light/960/600 960w",
        "/media/photo/coot-in-soft-light/1440/900 1440w",
        "/media/photo/coot-in-soft-light/1920/1200 1920w",
      ],
      sizes: "(min-width: 1200px) 1200px, 100vw",
      attribution: "Kevin Ellen",
      ratio: {
        width: 8,
        height: 5,
      },
      meta: [
        {
          kind: "context",
          items: [
            {
              id: "location",
              label: "Location",
              description: "Where the photo was taken.",
              value: "Epping Forest, Essex",
            },
            {
              id: "capturedAt",
              label: "Captured",
              description: "When the photo was taken.",
              value: "9 May 2026",
              datetime: "2026-05-09T08:00:00.000Z",
            },
          ],
        },
        {
          kind: "settings",
          items: [
            {
              id: "shutterSpeed",
              label: "Shutter speed",
              description: "Exposure duration.",
              value: "1/800 sec",
            },
            {
              id: "aperture",
              label: "Aperture",
              description: "Lens aperture.",
              value: "f/7.1",
            },
            {
              id: "focalLength",
              label: "Focal length",
              description: "Lens focal length.",
              value: "500mm",
            },
            {
              id: "iso",
              label: "ISO",
              description: "Sensor sensitivity.",
              value: "ISO 12,800",
            },
          ],
        },
      ],
    });

    expect(mockedFormatDate).toHaveBeenCalledWith("2026-05-09T08:00:00.000Z", {
      includeTime: true,
      timeZone: "Europe/London",
    });
    expect(mockedNormaliseDimensionsToBase).toHaveBeenCalledWith(1600, 1000);
  });

  it("uses copyright before photographer for attribution", () => {
    expect(
      appRenderContextResolvePhoto(
        createPhoto({
          copyright: "© Kevin Ellen",
          photographer: "Kevin Ellen",
        }),
        createMetadataLabels(),
      ).attribution,
    ).toBe("© Kevin Ellen");
  });

  it("returns null attribution when copyright and photographer are missing", () => {
    expect(
      appRenderContextResolvePhoto(
        createPhoto({
          copyright: null,
          photographer: null,
        }),
        createMetadataLabels(),
      ).attribution,
    ).toBeNull();
  });

  it("formats whole-second shutter speeds", () => {
    const result = appRenderContextResolvePhoto(
      createPhoto({
        exposureTime: 2,
      }),
      createMetadataLabels(),
    );

    expect(result.meta).toContainEqual({
      kind: "settings",
      items: expect.arrayContaining([
        expect.objectContaining({
          id: "shutterSpeed",
          value: "2s",
        }),
      ]),
    });
  });

  it("omits empty metadata groups", () => {
    const result = appRenderContextResolvePhoto(
      createPhoto({
        readableLocation: undefined,
        capturedAt: null,
        exposureTime: null,
        aperture: null,
        focalLength: null,
        iso: null,
      }),
      createMetadataLabels(),
    );

    expect(result.meta).toEqual([]);
    expect(mockedFormatDate).not.toHaveBeenCalled();
  });

  it("normalises missing metadata descriptions to null", () => {
    const metadataLabels = createMetadataLabels();

    const result = appRenderContextResolvePhoto(
      createPhoto({
        readableLocation: "Epping Forest",
        capturedAt: null,
        exposureTime: null,
        aperture: null,
        focalLength: null,
        iso: null,
      }),
      {
        ...metadataLabels,
        location: {
          label: "Location",
        },
      },
    );

    expect(result.meta).toEqual([
      {
        kind: "context",
        items: [
          {
            id: "location",
            label: "Location",
            description: null,
            value: "Epping Forest",
          },
        ],
      },
    ]);
  });

  it("normalises missing setting and capture metadata descriptions to null", () => {
    const metadataLabels = createMetadataLabels();

    const result = appRenderContextResolvePhoto(createPhoto(), {
      ...metadataLabels,
      capturedAt: {
        label: "Captured",
      },
      shutterSpeed: {
        label: "Shutter speed",
      },
      aperture: {
        label: "Aperture",
      },
      focalLength: {
        label: "Focal length",
      },
      iso: {
        label: "ISO",
      },
    } as AppStateMetadataLabels);

    expect(result.meta).toEqual([
      {
        kind: "context",
        items: [
          {
            id: "location",
            label: "Location",
            description: "Where the photo was taken.",
            value: "Epping Forest, Essex",
          },
          {
            id: "capturedAt",
            label: "Captured",
            description: null,
            value: "9 May 2026",
            datetime: "2026-05-09T08:00:00.000Z",
          },
        ],
      },
      {
        kind: "settings",
        items: [
          {
            id: "shutterSpeed",
            label: "Shutter speed",
            description: null,
            value: "1/800 sec",
          },
          {
            id: "aperture",
            label: "Aperture",
            description: null,
            value: "f/7.1",
          },
          {
            id: "focalLength",
            label: "Focal length",
            description: null,
            value: "500mm",
          },
          {
            id: "iso",
            label: "ISO",
            description: null,
            value: "ISO 12,800",
          },
        ],
      },
    ]);
  });

  it("formats captured date without timezone when captured timezone is missing", () => {
    appRenderContextResolvePhoto(
      createPhoto({
        capturedAt: {
          utc: "2026-05-09T08:00:00.000Z",
          timezone: null,
        },
      }),
      createMetadataLabels(),
    );

    expect(mockedFormatDate).toHaveBeenCalledWith("2026-05-09T08:00:00.000Z", {
      includeTime: true,
      timeZone: undefined,
    });
  });
});
