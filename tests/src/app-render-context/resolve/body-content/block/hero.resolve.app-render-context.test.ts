// tests/src/app-render-context/resolve/body-content/block/hero.resolve.app-render-context.test.ts

import { resolveHeroBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/hero.resolve.app-render-context";
import { resolvePhotoAppRenderContext } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    resolvePhotoAppRenderContext: jest.fn(),
  }),
);

describe("resolveHeroBlockContentModuleAppRenderContext", () => {
  const mockedResolvePhotoAppRenderContext = jest.mocked(
    resolvePhotoAppRenderContext,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves the hero photo into a render-safe photo", () => {
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
    };

    const appContext = {
      metadataLabels,
    } as unknown as AppContext;

    const photo = {
      id: "photo-hero-about",
      cloudflareImageId: "cloudflare-hero-about",
    };

    const resolvedPhoto = {
      id: "photo-hero-about",
      src: "/media/photo/photo-hero-about",
      srcset: "/media/photo/photo-hero-about/400/267 400w",
      sizes: "100vw",
      width: 3000,
      height: 2000,
      ratio: "3 / 2",
      alt: "A coot carrying nesting material.",
      caption: "Coot nest-building behaviour.",
      attribution: null,
      meta: [],
    };

    const module = {
      kind: "hero",
      immersive: true,
      flow: "breakout",
      photo,
    } as never;

    mockedResolvePhotoAppRenderContext.mockReturnValue(resolvedPhoto as never);

    const result = resolveHeroBlockContentModuleAppRenderContext(
      appContext,
      module,
    );

    expect(result).toEqual({
      kind: "hero",
      immersive: true,
      flow: "breakout",
      photo: resolvedPhoto,
    });

    expect(mockedResolvePhotoAppRenderContext).toHaveBeenCalledTimes(1);
    expect(mockedResolvePhotoAppRenderContext).toHaveBeenCalledWith(
      photo,
      metadataLabels,
    );
  });
});
