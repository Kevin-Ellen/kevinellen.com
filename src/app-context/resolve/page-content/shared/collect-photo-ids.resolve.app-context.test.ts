// src/app-context/resolve/page-content/shared/collect-photo-ids.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateBlock } from "@shared-types/page-content/block/app-state.block.types";

import { appContextCollectPhotoIds } from "@app-context/resolve/page-content/shared/collect-photo-ids.resolve.app-context";

const createContext = (publicPages: AppState["getPublicPages"] = []) => ({
  publicPages,
});

describe("appContextCollectPhotoIds", () => {
  it("collects unique photo ids from direct photo blocks", () => {
    const blocks = [
      {
        kind: "hero",
        photoId: "coot",
        immersive: false,
        flow: "content",
      },
      {
        kind: "homepageHero",
        photoId: "coot",
        flow: "breakout",
        eyebrow: null,
        title: "Home",
        intro: [],
        primaryLink: null,
      },
    ] as unknown as readonly AppStateBlock[];

    expect(appContextCollectPhotoIds(blocks, createContext())).toEqual([
      "coot",
    ]);
  });

  it("collects photo ids recursively from article sections", () => {
    const blocks = [
      {
        kind: "articleSection",
        heading: {
          text: "Section",
          level: 2,
          visuallyHidden: false,
        },
        modules: [
          {
            kind: "hero",
            photoId: "heron",
            immersive: false,
            flow: "content",
          },
        ],
      },
    ] as unknown as readonly AppStateBlock[];

    expect(appContextCollectPhotoIds(blocks, createContext())).toEqual([
      "heron",
    ]);
  });

  it("collects journal listing photo ids from all journal pages", () => {
    const context = createContext([
      {
        kind: "journal",
        content: {
          content: [
            {
              kind: "hero",
              photoId: "journal-photo",
              immersive: false,
              flow: "content",
            },
          ],
        },
      },
      {
        kind: "article",
        content: {
          content: [
            {
              kind: "hero",
              photoId: "ignored-photo",
              immersive: false,
              flow: "content",
            },
          ],
        },
      },
    ] as never);

    expect(
      appContextCollectPhotoIds(
        [
          {
            kind: "journalListing",
          },
        ] as unknown as readonly AppStateBlock[],
        context,
      ),
    ).toEqual(["journal-photo"]);
  });

  it("collects homepage journal listing photo ids from only the first journal page", () => {
    const context = createContext([
      {
        kind: "journal",
        content: {
          content: [
            {
              kind: "hero",
              photoId: "first-photo",
              immersive: false,
              flow: "content",
            },
          ],
        },
      },
      {
        kind: "journal",
        content: {
          content: [
            {
              kind: "hero",
              photoId: "second-photo",
              immersive: false,
              flow: "content",
            },
          ],
        },
      },
    ] as never);

    expect(
      appContextCollectPhotoIds(
        [
          {
            kind: "homepageJournalListing",
          },
        ] as unknown as readonly AppStateBlock[],
        context,
      ),
    ).toEqual(["first-photo"]);
  });

  it("collects photo ids from sequence blocks", () => {
    const blocks = [
      {
        kind: "sequence",

        immersive: false,

        flow: "content",

        caption: [
          {
            kind: "text",
            value: "Bird sequence",
          },
        ],

        photos: {
          1: "rook-wandering-in-amager-meadows",
          2: "juvenile-white-wagtail-chilling-in-amager-meadows",
          3: "hooded-crow-in-amager-meadows",
        },
      },
    ] as unknown as readonly AppStateBlock[];

    expect(appContextCollectPhotoIds(blocks, createContext())).toEqual([
      "rook-wandering-in-amager-meadows",
      "juvenile-white-wagtail-chilling-in-amager-meadows",
      "hooded-crow-in-amager-meadows",
    ]);
  });

  it("ignores blocks without photo collectors", () => {
    expect(
      appContextCollectPhotoIds(
        [
          {
            kind: "paragraph",
            content: [],
          },
        ] as unknown as readonly AppStateBlock[],
        createContext(),
      ),
    ).toEqual([]);
  });
});
