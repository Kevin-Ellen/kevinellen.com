// tests/src/app-context/resolve/page/content/footer/journal-entry-footer.page-content.resolve.app-context.test.ts

import { appContextResolveJournalEntryFooterModule } from "@app-context/resolve/page/content/footer/journal-entry-footer.page-content.resolve.app-context";

const createModule = (overrides = {}) => ({
  kind: "journalEntryFooter",
  publication: {
    author: "Kevin Ellen",
    publishedAt: "2025-05-27T10:30:00.000Z",
    updatedAt: [],
  },
  tags: ["Mallorca", "Birds"],
  ...overrides,
});

const createPhoto = (overrides = {}) => ({
  id: "photo-1",
  title: "Photo",
  alt: "Photo alt",
  commentary: "Photo commentary",
  readableLocation: "Walthamstow Wetlands",
  width: 3000,
  height: 2000,
  cloudflareImageId: "cloudflare-image-id",
  cameraMake: "Canon",
  cameraModel: "EOS R7",
  lensMake: "Canon",
  lensModel: "RF100-500mm F4.5-7.1 L IS USM",
  ...overrides,
});

describe("appContextResolveJournalEntryFooterModule", () => {
  it("derives unique cameras and lenses from resolved photos", () => {
    const module = createModule();
    const context = {
      photos: [
        createPhoto(),
        createPhoto({
          id: "photo-2",
        }),
      ],
    };

    const result = appContextResolveJournalEntryFooterModule(
      module as never,
      context as never,
    );

    expect(result).toEqual({
      ...module,
      equipment: {
        cameras: ["Canon EOS R7"],
        lenses: ["RF100-500mm F4.5-7.1 L IS USM"],
      },
    });
  });

  it("handles null camera and lens values", () => {
    const result = appContextResolveJournalEntryFooterModule(
      createModule() as never,
      {
        photos: [
          createPhoto({
            cameraMake: null,
            cameraModel: null,
            lensModel: null,
          }),
        ],
      } as never,
    );

    expect(result.equipment).toEqual({
      cameras: [],
      lenses: [],
    });
  });

  it("uses camera model alone when camera make is missing", () => {
    const result = appContextResolveJournalEntryFooterModule(
      createModule() as never,
      {
        photos: [
          createPhoto({
            cameraMake: null,
            cameraModel: "EOS R7",
          }),
        ],
      } as never,
    );

    expect(result.equipment.cameras).toEqual(["EOS R7"]);
  });

  it("uses camera make alone when camera model is missing", () => {
    const result = appContextResolveJournalEntryFooterModule(
      createModule() as never,
      {
        photos: [
          createPhoto({
            cameraMake: "Canon",
            cameraModel: null,
          }),
        ],
      } as never,
    );

    expect(result.equipment.cameras).toEqual(["Canon"]);
  });

  it("avoids duplicating the camera make when the model already starts with the make", () => {
    const result = appContextResolveJournalEntryFooterModule(
      createModule() as never,
      {
        photos: [
          createPhoto({
            cameraMake: "Canon",
            cameraModel: "Canon EOS R7",
          }),
        ],
      } as never,
    );

    expect(result.equipment.cameras).toEqual(["Canon EOS R7"]);
  });

  it("filters empty strings from camera and lens output", () => {
    const result = appContextResolveJournalEntryFooterModule(
      createModule() as never,
      {
        photos: [
          createPhoto({
            cameraMake: "",
            cameraModel: "",
            lensModel: "",
          }),
        ],
      } as never,
    );

    expect(result.equipment).toEqual({
      cameras: [],
      lenses: [],
    });
  });

  it("preserves publication and tags unchanged", () => {
    const module = createModule({
      tags: ["Coots", "Field notes"],
    });

    const result = appContextResolveJournalEntryFooterModule(
      module as never,
      {
        photos: [],
      } as never,
    );

    expect(result.publication).toBe(module.publication);
    expect(result.tags).toBe(module.tags);
  });
});
