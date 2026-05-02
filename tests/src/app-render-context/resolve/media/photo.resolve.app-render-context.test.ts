// tests/src/app-render-context/resolve/media/photo.resolve.app-render-context.test.ts

import { resolvePhotoAppRenderContext } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

const metadataLabels = {
  location: {
    label: "Location",
  },
  shutterSpeed: {
    label: "Shutter speed",
    description: "How long the camera sensor was exposed to light.",
  },
  aperture: {
    label: "Aperture",
    description: "The size of the lens opening controlling light intake.",
  },
  focalLength: {
    label: "Focal length",
    description: "The zoom level or field of view used for the photograph.",
  },
  iso: {
    label: "ISO",
    description: "The camera’s sensitivity to light.",
  },
  publishedAt: {
    label: "Published",
  },
  lastUpdatedAt: {
    label: "Last updated",
  },
  capturedAt: {
    label: "Captured",
  },
  author: {
    label: "Author",
  },
} as const;

const createPhoto = (overrides = {}) => ({
  id: "coot-nest-handover",
  sourceFileName: "coot-nest-handover.jpg",
  title: "Coot nest handover",
  alt: "A coot carrying nesting material.",
  commentary: "A coot passes nesting material through the reeds.",
  readableLocation: "Walthamstow Wetlands",
  width: 3000,
  height: 2000,
  cloudflareImageId: "cloudflare-image-id",
  capturedAt: "2025-05-27T10:30:00.000Z",
  photographer: "Kevin Ellen",
  copyright: null,
  cameraMake: "Canon",
  cameraModel: "EOS R7",
  lensMake: "Canon",
  lensModel: "RF100-500mm F4.5-7.1 L IS USM",
  exposureTime: 0.0003125,
  aperture: 10,
  focalLength: 700,
  iso: 2000,
  ...overrides,
});

describe("resolvePhotoAppRenderContext", () => {
  it("creates render-safe photo URLs, srcset, sizes, and ratio", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto() as never,
      metadataLabels as never,
    );

    expect(result).toMatchObject({
      id: "coot-nest-handover",
      title: "Coot nest handover",
      alt: "A coot carrying nesting material.",
      commentary: "A coot passes nesting material through the reeds.",
      readableLocation: "Walthamstow Wetlands",
      capturedAt: "2025-05-27T10:30:00.000Z",
      width: 3000,
      height: 2000,
      src: "/media/photo/coot-nest-handover",
      sizes: "(min-width: 1200px) 1200px, 100vw",
      ratio: {
        width: 100,
        height: 67,
      },
    });

    expect(result.srcset).toEqual([
      "/media/photo/coot-nest-handover/640/427 640w",
      "/media/photo/coot-nest-handover/960/640 960w",
      "/media/photo/coot-nest-handover/1440/960 1440w",
      "/media/photo/coot-nest-handover/1920/1280 1920w",
    ]);
  });

  it("removes AppContext-only and Cloudflare-only fields", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto({
        latitude: 51.5,
        longitude: -0.1,
        resolvedLocation: "London, England",
      }) as never,
      metadataLabels as never,
    );

    expect(result).not.toHaveProperty("cloudflareImageId");
    expect(result).not.toHaveProperty("cameraMake");
    expect(result).not.toHaveProperty("cameraModel");
    expect(result).not.toHaveProperty("lensMake");
    expect(result).not.toHaveProperty("lensModel");
    expect(result).not.toHaveProperty("latitude");
    expect(result).not.toHaveProperty("longitude");
    expect(result).not.toHaveProperty("resolvedLocation");
  });

  it("uses copyright as attribution before photographer", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto({
        copyright: "© Kevin Ellen",
        photographer: "Kevin Ellen",
      }) as never,
      metadataLabels as never,
    );

    expect(result.attribution).toBe("© Kevin Ellen");
  });

  it("falls back to photographer when copyright is missing", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto({
        copyright: null,
        photographer: "Kevin Ellen",
      }) as never,
      metadataLabels as never,
    );

    expect(result.attribution).toBe("Kevin Ellen");
  });

  it("returns null attribution when copyright and photographer are missing", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto({
        copyright: null,
        photographer: null,
      }) as never,
      metadataLabels as never,
    );

    expect(result.attribution).toBeNull();
  });

  it("groups context and camera settings metadata", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto() as never,
      metadataLabels as never,
    );

    expect(result.meta).toEqual([
      {
        kind: "context",
        items: [
          {
            id: "location",
            label: "Location",
            description: null,
            value: "Walthamstow Wetlands",
          },
          {
            id: "capturedAt",
            label: "Captured",
            description: null,
            value: "27 May 2025",
          },
        ],
      },
      {
        kind: "settings",
        items: [
          {
            id: "shutterSpeed",
            label: "Shutter speed",
            description: "How long the camera sensor was exposed to light.",
            value: "1/3200 sec",
          },
          {
            id: "aperture",
            label: "Aperture",
            description:
              "The size of the lens opening controlling light intake.",
            value: "f/10",
          },
          {
            id: "focalLength",
            label: "Focal length",
            description:
              "The zoom level or field of view used for the photograph.",
            value: "700mm",
          },
          {
            id: "iso",
            label: "ISO",
            description: "The camera’s sensitivity to light.",
            value: "ISO 2,000",
          },
        ],
      },
    ]);
  });

  it("formats long exposure shutter speeds as seconds", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto({
        exposureTime: 1,
      }) as never,
      metadataLabels as never,
    );

    expect(result.meta[1]?.items[0]).toMatchObject({
      id: "shutterSpeed",
      value: "1s",
    });
  });

  it("omits empty metadata groups", () => {
    const result = resolvePhotoAppRenderContext(
      createPhoto({
        readableLocation: "",
        capturedAt: null,
        exposureTime: null,
        aperture: null,
        focalLength: null,
        iso: null,
      }) as never,
      metadataLabels as never,
    );

    expect(result.meta).toEqual([]);
  });

  it("throws when capturedAt cannot be formatted", () => {
    expect(() =>
      resolvePhotoAppRenderContext(
        createPhoto({
          capturedAt: "not-a-date",
        }) as never,
        metadataLabels as never,
      ),
    ).toThrow('Invalid date value: "not-a-date"');
  });

  it("uses null metadata descriptions when labels do not provide descriptions", () => {
    const labelsWithoutDescriptions = {
      location: { label: "Location" },
      capturedAt: { label: "Captured" },
      shutterSpeed: { label: "Shutter speed" },
      aperture: { label: "Aperture" },
      focalLength: { label: "Focal length" },
      iso: { label: "ISO" },
    };

    const result = resolvePhotoAppRenderContext(
      createPhoto() as never,
      labelsWithoutDescriptions as never,
    );

    expect(result.meta).toEqual([
      {
        kind: "context",
        items: [
          {
            id: "location",
            label: "Location",
            description: null,
            value: "Walthamstow Wetlands",
          },
          {
            id: "capturedAt",
            label: "Captured",
            description: null,
            value: "27 May 2025",
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
            value: "1/3200 sec",
          },
          {
            id: "aperture",
            label: "Aperture",
            description: null,
            value: "f/10",
          },
          {
            id: "focalLength",
            label: "Focal length",
            description: null,
            value: "700mm",
          },
          {
            id: "iso",
            label: "ISO",
            description: null,
            value: "ISO 2,000",
          },
        ],
      },
    ]);
  });
});
