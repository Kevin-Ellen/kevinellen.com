// tests/src/app-context/resolve/page/content/block/hero.resolve.app-context.test.ts

import { appContextResolveHeroBlockContentModule } from "@app-context/resolve/page/content/block/hero.resolve.app-context";

describe("appContextResolveHeroBlockContentModule", () => {
  const photo = {
    id: "photo-hero-about",
    cloudflareImageId: "cloudflare-hero-about",
    alt: "A coot carrying nesting material.",
    caption: "Coot nest-building behaviour.",
    width: 3000,
    height: 2000,
    capturedAt: "2025-05-27T10:30:00.000Z",
    location: "Walthamstow Wetlands",
    resolvedLocation: "Walthamstow Wetlands, London",
    latitude: null,
    longitude: null,
    cameraMake: "Canon",
    cameraModel: "EOS R7",
    lensMake: "Canon",
    lensModel: "RF100-500mm F4.5-7.1 L IS USM",
    shutterSpeed: "1/3200",
    aperture: "10",
    focalLength: 700,
    iso: 2000,
  } as const;

  const createContext = () =>
    ({
      photos: [photo],
    }) as never;

  it("replaces photoId with the resolved photo", () => {
    const module = {
      kind: "hero",
      photoId: "photo-hero-about",
      immersive: false,
      flow: "breakout",
    } as const;

    const result = appContextResolveHeroBlockContentModule(
      module,
      createContext(),
    );

    expect(result).toEqual({
      kind: "hero",
      photoId: "photo-hero-about",
      immersive: false,
      flow: "breakout",
      photo,
    });
  });

  it("keeps the hero display fields unchanged", () => {
    const module = {
      kind: "hero",
      photoId: "photo-hero-about",
      immersive: true,
      flow: "content",
    } as const;

    const result = appContextResolveHeroBlockContentModule(
      module,
      createContext(),
    );

    expect(result.kind).toBe("hero");
    expect(result.immersive).toBe(true);
    expect(result.flow).toBe("content");
  });

  it("throws when no resolved photo exists for the hero photoId", () => {
    const module = {
      kind: "hero",
      photoId: "missing-photo",
      immersive: false,
      flow: "breakout",
    } as const;

    expect(() =>
      appContextResolveHeroBlockContentModule(module, {
        photos: [photo],
      } as never),
    ).toThrow("No AppContext photo resolved for hero photoId: missing-photo");
  });
});
