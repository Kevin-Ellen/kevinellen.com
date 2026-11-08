// src/app/life-cycle/app-render-context/resolvers/primitives/photo/photo.primitive.resolver.app-render-context.test.ts

import { resolvePhotoAppRenderContext } from "./photo.primitive.resolver.app-render-context";

type Input = Parameters<typeof resolvePhotoAppRenderContext>[0];
type Photo = Input["photo"];

describe("Photo primitive AppRenderContext resolver", () => {
  const createPhoto = (overrides: Record<string, unknown> = {}): Photo =>
    ({
      id: "fox-001",
      title: "Red Fox",
      alt: "A red fox in woodland",
      commentary: "Photographed at sunrise",
      readableLocation: "Epping Forest, Essex",
      width: 6000,
      height: 4000,
      dimensions: {
        width: 1400,
        height: 933,
      },
      cloudflareImageId: "cloudflare-fox-001",
      exposureTime: 1 / 500,
      aperture: 7.1,
      focalLength: 500,
      iso: 1600,
      ...overrides,
    }) as unknown as Photo;

  const resolve = (
    photo: Photo = createPhoto(),
    overrides: Pick<Input, "alt" | "commentary"> = {},
  ) =>
    resolvePhotoAppRenderContext({
      photo,
      ...overrides,
    });

  describe("Image URLs and responsive widths", () => {
    it("generates the primary image URL from delivery dimensions", () => {
      const result = resolve();

      expect(result.image.src).toBe("/media/photo/1400/933/fox-001");
    });

    it("generates the complete srcSet up to the selected width", () => {
      const result = resolve();

      expect(result.image.srcSet).toBe(
        [
          "/media/photo/400/267/fox-001 400w",
          "/media/photo/640/427/fox-001 640w",
          "/media/photo/800/533/fox-001 800w",
          "/media/photo/1024/683/fox-001 1024w",
          "/media/photo/1200/800/fox-001 1200w",
          "/media/photo/1400/933/fox-001 1400w",
        ].join(", "),
      );
    });

    it("does not include responsive widths above the selected width", () => {
      const result = resolve();

      expect(result.image.srcSet).not.toContain("1600w");
      expect(result.image.srcSet).not.toContain("1920w");
    });

    it("does not duplicate a standard responsive width", () => {
      const result = resolve(
        createPhoto({
          dimensions: {
            width: 1200,
            height: 800,
          },
        }),
      );

      expect(result.image.srcSet.match(/1200w/g)).toHaveLength(1);
    });

    it("supports photographs narrower than the first breakpoint", () => {
      const result = resolve(
        createPhoto({
          width: 300,
          height: 200,
          dimensions: {
            width: 300,
            height: 200,
          },
        }),
      );

      expect(result.image.src).toBe("/media/photo/300/200/fox-001");

      expect(result.image.srcSet).toBe("/media/photo/300/200/fox-001 300w");
    });

    it("supports a custom selected width between breakpoints", () => {
      const result = resolve(
        createPhoto({
          dimensions: {
            width: 900,
            height: 600,
          },
        }),
      );

      expect(result.image.srcSet).toContain(
        "/media/photo/900/600/fox-001 900w",
      );

      expect(result.image.srcSet).not.toContain("1024w");
    });

    it("calculates portrait image heights correctly", () => {
      const result = resolve(
        createPhoto({
          width: 3000,
          height: 4500,
          dimensions: {
            width: 1400,
            height: 2100,
          },
        }),
      );

      expect(result.image.src).toBe("/media/photo/1400/2100/fox-001");
    });

    it("URL-encodes the photo identifier", () => {
      const result = resolve(
        createPhoto({
          id: "forest/fox #1",
        }),
      );

      expect(result.image.src).toBe(
        "/media/photo/1400/933/forest%2Ffox%20%231",
      );
    });

    it("uses the Cloudflare image ID when available", () => {
      const result = resolve();

      expect(result.image.id).toBe("cloudflare-fox-001");
    });

    it("falls back to the photo ID without a Cloudflare image ID", () => {
      const result = resolve(
        createPhoto({
          cloudflareImageId: null,
        }),
      );

      expect(result.image.id).toBe("fox-001");
    });

    it("preserves original photographic dimensions", () => {
      const result = resolve();

      expect(result.width).toBe(6000);
      expect(result.height).toBe(4000);
    });
  });

  describe("Editorial metadata", () => {
    it("preserves the photo identity, title and location", () => {
      const result = resolve();

      expect(result).toMatchObject({
        id: "fox-001",
        title: "Red Fox",
        location: "Epping Forest, Essex",
      });
    });

    it("uses published alt text and commentary by default", () => {
      const result = resolve();

      expect(result.alt).toBe("A red fox in woodland");
      expect(result.commentary).toBe("Photographed at sunrise");
    });

    it("allows an authored alt override", () => {
      const result = resolve(createPhoto(), {
        alt: "A fox looking towards the camera",
      });

      expect(result.alt).toBe("A fox looking towards the camera");
      expect(result.commentary).toBe("Photographed at sunrise");
    });

    it("allows an authored commentary override", () => {
      const result = resolve(createPhoto(), {
        commentary: "A brief encounter beside the path",
      });

      expect(result.commentary).toBe("A brief encounter beside the path");
      expect(result.alt).toBe("A red fox in woodland");
    });

    it("preserves an explicitly empty alt override", () => {
      const result = resolve(createPhoto(), {
        alt: "",
      });

      expect(result.alt).toBe("");
    });

    it("preserves an explicitly empty commentary override", () => {
      const result = resolve(createPhoto(), {
        commentary: "",
      });

      expect(result.commentary).toBe("");
    });

    it("allows null to explicitly suppress commentary", () => {
      const result = resolve(createPhoto(), {
        commentary: null,
      });

      expect(result.commentary).toBeNull();
    });

    it("falls back when commentary is undefined", () => {
      const result = resolve(createPhoto(), {
        commentary: undefined,
      });

      expect(result.commentary).toBe("Photographed at sunrise");
    });
  });

  describe("Camera metadata", () => {
    it("formats a fractional shutter speed", () => {
      expect(resolve().metadata.shutter).toBe("1/500s");
    });

    it("rounds fractional shutter denominators", () => {
      const result = resolve(
        createPhoto({
          exposureTime: 1 / 123,
        }),
      );

      expect(result.metadata.shutter).toBe("1/123s");
    });

    it("formats a shutter speed of exactly one second", () => {
      const result = resolve(
        createPhoto({
          exposureTime: 1,
        }),
      );

      expect(result.metadata.shutter).toBe("1s");
    });

    it("formats shutter speeds longer than one second", () => {
      const result = resolve(
        createPhoto({
          exposureTime: 2.5,
        }),
      );

      expect(result.metadata.shutter).toBe("2.5s");
    });

    it.each([0, -1])(
      "uses a dash for invalid shutter value %i",
      (exposureTime) => {
        const result = resolve(
          createPhoto({
            exposureTime,
          }),
        );

        expect(result.metadata.shutter).toBe("—");
      },
    );

    it("formats aperture, focal length and ISO", () => {
      expect(resolve().metadata).toEqual({
        shutter: "1/500s",
        aperture: "f/7.1",
        focalLength: "500mm",
        iso: "1600",
      });
    });

    it("preserves decimal focal lengths and aperture values", () => {
      const result = resolve(
        createPhoto({
          aperture: 5.6,
          focalLength: 35.5,
          iso: 800,
        }),
      );

      expect(result.metadata).toMatchObject({
        aperture: "f/5.6",
        focalLength: "35.5mm",
        iso: "800",
      });
    });
  });

  describe("Object integrity", () => {
    it("returns a new presentation object", () => {
      const photo = createPhoto();

      const result = resolve(photo);

      expect(result).not.toBe(photo);
      expect(result.image).toBeDefined();
      expect(result.metadata).toBeDefined();
    });

    it("does not mutate the original photo metadata", () => {
      const photo = Object.freeze(createPhoto());

      const result = resolve(photo, {
        alt: "Context-specific alt text",
        commentary: null,
      });

      expect(photo.alt).toBe("A red fox in woodland");
      expect(photo.commentary).toBe("Photographed at sunrise");
      expect(result.alt).toBe("Context-specific alt text");
      expect(result.commentary).toBeNull();
    });
  });
});
