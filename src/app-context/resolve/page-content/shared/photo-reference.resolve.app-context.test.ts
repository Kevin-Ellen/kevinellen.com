// src/app-context/resolve/page-content/shared/photo-reference.resolve.app-context.test.ts

import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { AuthoredPhotoReference } from "@shared-types/media/render-image/authored.render-image.types";

import { appContextResolvePhotoReference } from "@app-context/resolve/page-content/shared/photo-reference.resolve.app-context";

const photo = {
  id: "coot",
  title: "Coot",
} as AppContextPhotoMetadata;

const delivery = {
  sizes: "(min-width: 1200px) 640px, calc(100vw - 2rem)",
  widths: [640, 960, 1280],
} as const;

const createReference = (
  overrides: Partial<AuthoredPhotoReference> = {},
): AuthoredPhotoReference => ({
  id: "coot",
  ...overrides,
});

describe("appContextResolvePhotoReference", () => {
  it("returns photo metadata with the supplied delivery defaults", () => {
    expect(
      appContextResolvePhotoReference({
        reference: createReference(),
        photo,
        delivery,
      }),
    ).toEqual({
      metadata: photo,
      delivery,
    });
  });

  it("prefers authored sizes when provided", () => {
    expect(
      appContextResolvePhotoReference({
        reference: createReference({
          sizes: "(min-width: 900px) 400px, 90vw",
        }),
        photo,
        delivery,
      }).delivery,
    ).toEqual({
      sizes: "(min-width: 900px) 400px, 90vw",
      widths: delivery.widths,
    });
  });

  it("ignores blank authored sizes", () => {
    expect(
      appContextResolvePhotoReference({
        reference: createReference({
          sizes: "   ",
        }),
        photo,
        delivery,
      }).delivery.sizes,
    ).toBe(delivery.sizes);
  });

  it("prefers authored widths when provided", () => {
    expect(
      appContextResolvePhotoReference({
        reference: createReference({
          widths: [320, 480],
        }),
        photo,
        delivery,
      }).delivery,
    ).toEqual({
      sizes: delivery.sizes,
      widths: [320, 480],
    });
  });

  it("ignores empty authored widths", () => {
    expect(
      appContextResolvePhotoReference({
        reference: createReference({
          widths: [],
        }),
        photo,
        delivery,
      }).delivery.widths,
    ).toBe(delivery.widths);
  });

  it("allows authored sizes and widths to override together", () => {
    expect(
      appContextResolvePhotoReference({
        reference: createReference({
          sizes: "100vw",
          widths: [960, 1280, 1600],
        }),
        photo,
        delivery,
      }).delivery,
    ).toEqual({
      sizes: "100vw",
      widths: [960, 1280, 1600],
    });
  });
});
