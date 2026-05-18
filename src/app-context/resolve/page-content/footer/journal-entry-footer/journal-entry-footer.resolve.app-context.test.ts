// src/app-context/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.types";

import { appContextResolveJournalEntryFooter } from "@app-context/resolve/page-content/footer/journal-entry-footer/journal-entry-footer.resolve.app-context";

const journalFooter: AppStateJournalEntryFooter = {
  kind: "journalEntryFooter",
  publication: {
    author: "Kevin",
    publishedAt: "2025-05-10",
    updatedAt: [],
  },
  tags: [],
};

describe("appContextResolveJournalEntryFooterModule", () => {
  it("collects unique camera and lens labels from page photos only", () => {
    const context = {
      pagePhotos: [
        {
          cameraMake: "Canon",
          cameraModel: "Canon EOS R7",
          lensModel: "RF 100-500mm F4.5-7.1L IS USM",
        },
        {
          cameraMake: "Canon",
          cameraModel: "EOS R5",
          lensModel: "RF 100mm F2.8 L MACRO IS USM",
        },
        {
          cameraMake: "Canon",
          cameraModel: "Canon EOS R7",
          lensModel: "RF 100-500mm F4.5-7.1L IS USM",
        },
      ],
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveJournalEntryFooter(journalFooter, context);

    expect(result).toEqual({
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin",
        publishedAt: "2025-05-10",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: ["Canon EOS R7", "Canon EOS R5"],
        lenses: [
          "RF 100-500mm F4.5-7.1L IS USM",
          "RF 100mm F2.8 L MACRO IS USM",
        ],
      },
    });
  });

  it("ignores globally loaded photos when resolving journal footer equipment", () => {
    const context = {
      photos: [
        {
          cameraMake: "Canon",
          cameraModel: "Canon EOS R7",
          lensModel: "RF100-500mm F4.5-7.1 L IS USM + EXTENDER RF1.4x",
        },
      ],
      pagePhotos: [
        {
          cameraMake: "Canon",
          cameraModel: "Canon EOS R7",
          lensModel: "RF100-500mm F4.5-7.1 L IS USM",
        },
      ],
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveJournalEntryFooter(journalFooter, context);

    expect(result.equipment).toEqual({
      cameras: ["Canon EOS R7"],
      lenses: ["RF100-500mm F4.5-7.1 L IS USM"],
    });
  });

  it("filters null and empty equipment values", () => {
    const context = {
      pagePhotos: [
        {
          cameraMake: null,
          cameraModel: null,
          lensModel: null,
        },
        {
          cameraMake: "",
          cameraModel: "   ",
          lensModel: "",
        },
      ],
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveJournalEntryFooter(journalFooter, context);

    expect(result.equipment).toEqual({
      cameras: [],
      lenses: [],
    });
  });

  it("uses camera model directly when it already includes the make", () => {
    const context = {
      pagePhotos: [
        {
          cameraMake: "Canon",
          cameraModel: "Canon EOS R7",
          lensModel: null,
        },
      ],
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveJournalEntryFooter(journalFooter, context);

    expect(result.equipment.cameras).toEqual(["Canon EOS R7"]);
  });

  it("combines camera make and model when needed", () => {
    const context = {
      pagePhotos: [
        {
          cameraMake: "Canon",
          cameraModel: "EOS R5",
          lensModel: null,
        },
      ],
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveJournalEntryFooter(journalFooter, context);

    expect(result.equipment.cameras).toEqual(["Canon EOS R5"]);
  });
});
