// src/shared/resolvers/assets/photo/photo.asset.resolver.shared.app-init.test.ts

import type { PhotoAssetAuthored } from "../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

import { resolvePhotoAppInit } from "./photo.asset.resolver.shared.app-init";

describe("Photo AppInit resolver", () => {
  const createPhoto = (
    overrides: Record<string, unknown> = {},
  ): PhotoAssetAuthored =>
    ({
      id: "forest-fox",
      title: "Red fox in Epping Forest",
      alt: "A red fox standing in woodland",
      commentary: "An encounter during an autumn walk.",
      species: null,
      ...overrides,
    }) as unknown as PhotoAssetAuthored;

  describe("Species resolution", () => {
    it("returns null when species is undefined", () => {
      const photo = createPhoto({ species: undefined });

      expect(resolvePhotoAppInit(photo).species).toBeNull();
    });

    it("preserves null species", () => {
      const photo = createPhoto({ species: null });

      expect(resolvePhotoAppInit(photo).species).toBeNull();
    });

    it("preserves an empty species array", () => {
      const photo = createPhoto({ species: [] });

      expect(resolvePhotoAppInit(photo).species).toEqual([]);
    });

    it("defaults an unspecified taxon rank to species", () => {
      const photo = createPhoto({
        species: [
          {
            name: "Red fox",
            scientificName: "Vulpes vulpes",
          },
        ],
      });

      expect(resolvePhotoAppInit(photo).species).toEqual([
        {
          name: "Red fox",
          scientificName: "Vulpes vulpes",
          taxonRank: "species",
        },
      ]);
    });

    it("defaults every unspecified taxon rank to species", () => {
      const photo = createPhoto({
        species: [
          {
            name: "Red fox",
            scientificName: "Vulpes vulpes",
          },
          {
            name: "Fallow deer",
            scientificName: "Dama dama",
          },
        ],
      });

      expect(resolvePhotoAppInit(photo).species).toEqual([
        {
          name: "Red fox",
          scientificName: "Vulpes vulpes",
          taxonRank: "species",
        },
        {
          name: "Fallow deer",
          scientificName: "Dama dama",
          taxonRank: "species",
        },
      ]);
    });

    it("preserves an explicitly authored species rank", () => {
      const photo = createPhoto({
        species: [
          {
            name: "Red fox",
            scientificName: "Vulpes vulpes",
            taxonRank: "species",
          },
        ],
      });

      expect(resolvePhotoAppInit(photo).species?.[0]?.taxonRank).toBe(
        "species",
      );
    });

    it("preserves an explicitly authored subspecies rank", () => {
      const photo = createPhoto({
        species: [
          {
            name: "Pied wagtail",
            scientificName: "Motacilla alba yarrellii",
            taxonRank: "subspecies",
          },
        ],
      });

      expect(resolvePhotoAppInit(photo).species).toEqual([
        {
          name: "Pied wagtail",
          scientificName: "Motacilla alba yarrellii",
          taxonRank: "subspecies",
        },
      ]);
    });

    it("preserves different taxonomic ranks in the same photograph", () => {
      const photo = createPhoto({
        species: [
          {
            name: "Western marsh harrier",
            scientificName: "Circus aeruginosus",
          },
          {
            name: "Pied wagtail",
            scientificName: "Motacilla alba yarrellii",
            taxonRank: "subspecies",
          },
        ],
      });

      expect(resolvePhotoAppInit(photo).species).toEqual([
        {
          name: "Western marsh harrier",
          scientificName: "Circus aeruginosus",
          taxonRank: "species",
        },
        {
          name: "Pied wagtail",
          scientificName: "Motacilla alba yarrellii",
          taxonRank: "subspecies",
        },
      ]);
    });

    it("preserves additional species metadata", () => {
      const photo = createPhoto({
        species: [
          {
            name: "Red fox",
            scientificName: "Vulpes vulpes",
            family: "Canidae",
          },
        ],
      });

      expect(resolvePhotoAppInit(photo).species?.[0]).toEqual({
        name: "Red fox",
        scientificName: "Vulpes vulpes",
        family: "Canidae",
        taxonRank: "species",
      });
    });
  });

  describe("Data integrity", () => {
    it("preserves all other photo properties", () => {
      const photo = createPhoto({
        photographer: "Kevin Ellen",
        sourceFileName: "forest-fox.jpg",
        location: {
          name: "Epping Forest",
        },
      });

      const result = resolvePhotoAppInit(photo);

      expect(result).toMatchObject({
        id: "forest-fox",
        title: "Red fox in Epping Forest",
        alt: "A red fox standing in woodland",
        commentary: "An encounter during an autumn walk.",
        photographer: "Kevin Ellen",
        sourceFileName: "forest-fox.jpg",
        location: {
          name: "Epping Forest",
        },
      });
    });

    it("does not mutate the authored photograph", () => {
      const species = [
        {
          scientificName: "Vulpes vulpes",
          commonName: "Red fox",
        },
      ];

      const photo = createPhoto({ species });

      resolvePhotoAppInit(photo);

      expect(species).toEqual([
        {
          scientificName: "Vulpes vulpes",
          commonName: "Red fox",
        },
      ]);

      expect(species[0]).not.toHaveProperty("taxonRank");
    });

    it("returns a new photograph object", () => {
      const photo = createPhoto();

      const result = resolvePhotoAppInit(photo);

      expect(result).not.toBe(photo);
    });

    it("creates a new species array", () => {
      const photo = createPhoto({
        species: [
          {
            scientificName: "Vulpes vulpes",
          },
        ],
      });

      const result = resolvePhotoAppInit(photo);

      expect(result.species).not.toBe(photo.species);
    });

    it("creates new species objects", () => {
      const photo = createPhoto({
        species: [
          {
            scientificName: "Vulpes vulpes",
          },
        ],
      });

      const result = resolvePhotoAppInit(photo);

      expect(result.species?.[0]).not.toBe(photo.species?.[0]);
    });

    it("preserves references to unrelated nested properties", () => {
      const resolvedLocation = {
        name: "Epping Forest",
      };

      const photo = createPhoto({ resolvedLocation });

      const result = resolvePhotoAppInit(photo);

      expect(result.resolvedLocation).toBe(resolvedLocation);
    });
  });
});
