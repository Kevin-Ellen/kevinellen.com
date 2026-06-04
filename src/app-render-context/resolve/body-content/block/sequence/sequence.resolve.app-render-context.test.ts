// src/app-render-context/resolve/body-content/block/sequence/sequence.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-context.sequence.block.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { appRenderContextResolveSequenceBlock } from "./sequence.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    appRenderContextResolvePhoto: jest.fn(),
  }),
);

describe("appRenderContextResolveSequenceBlock", () => {
  const mockedAppRenderContextResolvePhoto = jest.mocked(
    appRenderContextResolvePhoto,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves all photos in sequence order", () => {
    const resolvedPhoto = {
      id: "kingfisher-1",
      src: "/media/photo/kingfisher-1",
      meta: [
        {
          kind: "context",
          items: [
            {
              id: "location",
              label: "Location",
              description: null,
              value: "Rye Meads",
            },
          ],
        },
      ],
    };

    mockedAppRenderContextResolvePhoto.mockReturnValue(resolvedPhoto as never);

    const block: AppContextSequenceBlock = {
      kind: "sequence",
      immersive: false,
      flow: "content",
      caption: [
        {
          kind: "text",
          value: "A kingfisher exiting the water.",
        },
      ],
      photos: [
        {
          position: 1,
          photo: { id: "photo-1" } as never,
        },
        {
          position: 2,
          photo: { id: "photo-2" } as never,
        },
      ],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveSequenceBlock(appContext, block)).toEqual({
      kind: "sequence",
      immersive: false,
      flow: "content",
      caption: block.caption,
      photos: [
        {
          position: 1,
          photo: resolvedPhoto,
        },
        {
          position: 2,
          photo: resolvedPhoto,
        },
      ],
      meta: [
        {
          kind: "context",
          items: [
            {
              id: "location",
              label: "Location",
              description: null,
              value: "Rye Meads",
            },
          ],
        },
      ],
    });

    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledTimes(2);
  });

  it("preserves immersive breakout sequences", () => {
    const block: AppContextSequenceBlock = {
      kind: "sequence",
      immersive: true,
      flow: "breakout",
      caption: [],
      photos: [],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveSequenceBlock(appContext, block)).toEqual({
      kind: "sequence",
      immersive: true,
      flow: "breakout",
      caption: [],
      photos: [],
      meta: [],
    });

    expect(mockedAppRenderContextResolvePhoto).not.toHaveBeenCalled();
  });

  it("deduplicates metadata across sequence photos", () => {
    mockedAppRenderContextResolvePhoto
      .mockReturnValueOnce({
        id: "kingfisher-1",
        src: "/media/photo/kingfisher-1",
        meta: [
          {
            kind: "context",
            items: [
              {
                id: "location",
                label: "Location",
                description: null,
                value: "Rye Meads",
              },
            ],
          },
        ],
      } as never)
      .mockReturnValueOnce({
        id: "kingfisher-2",
        src: "/media/photo/kingfisher-2",
        meta: [
          {
            kind: "context",
            items: [
              {
                id: "location",
                label: "Location",
                description: null,
                value: "Rye Meads",
              },
            ],
          },
        ],
      } as never);

    const block: AppContextSequenceBlock = {
      kind: "sequence",
      immersive: false,
      flow: "content",
      caption: [],
      photos: [
        {
          position: 1,
          photo: { id: "photo-1" } as never,
        },
        {
          position: 2,
          photo: { id: "photo-2" } as never,
        },
      ],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveSequenceBlock(appContext, block).meta,
    ).toEqual([
      {
        kind: "context",
        items: [
          {
            id: "location",
            label: "Location",
            description: null,
            value: "Rye Meads",
          },
        ],
      },
    ]);
  });

  it("collapses repeated ISO metadata into a range", () => {
    mockedAppRenderContextResolvePhoto
      .mockReturnValueOnce({
        id: "kingfisher-1",
        src: "/media/photo/kingfisher-1",
        meta: [
          {
            kind: "settings",
            items: [
              {
                id: "iso",
                label: "ISO",
                description: "The camera’s sensitivity to light.",
                value: "ISO 5,000",
              },
            ],
          },
        ],
      } as never)
      .mockReturnValueOnce({
        id: "kingfisher-2",
        src: "/media/photo/kingfisher-2",
        meta: [
          {
            kind: "settings",
            items: [
              {
                id: "iso",
                label: "ISO",
                description: "The camera’s sensitivity to light.",
                value: "ISO 6,400",
              },
            ],
          },
        ],
      } as never);

    const block: AppContextSequenceBlock = {
      kind: "sequence",
      immersive: false,
      flow: "content",
      caption: [],
      photos: [
        {
          position: 1,
          photo: { id: "photo-1" } as never,
        },
        {
          position: 2,
          photo: { id: "photo-2" } as never,
        },
      ],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveSequenceBlock(appContext, block).meta,
    ).toEqual([
      {
        kind: "settings",
        items: [
          {
            id: "iso",
            label: "ISO",
            description: "The camera’s sensitivity to light.",
            value: "ISO 5,000–6,400",
          },
        ],
      },
    ]);
  });

  it("collapses repeated ISO metadata into a range", () => {
    mockedAppRenderContextResolvePhoto
      .mockReturnValueOnce({
        id: "kingfisher-1",
        src: "/media/photo/kingfisher-1",
        meta: [
          {
            kind: "settings",
            items: [
              {
                id: "iso",
                label: "ISO",
                description: "The camera’s sensitivity to light.",
                value: "ISO 5,000",
              },
            ],
          },
        ],
      } as never)
      .mockReturnValueOnce({
        id: "kingfisher-2",
        src: "/media/photo/kingfisher-2",
        meta: [
          {
            kind: "settings",
            items: [
              {
                id: "iso",
                label: "ISO",
                description: "The camera’s sensitivity to light.",
                value: "ISO 6,400",
              },
            ],
          },
        ],
      } as never);

    const block: AppContextSequenceBlock = {
      kind: "sequence",
      immersive: false,
      flow: "content",
      caption: [],
      photos: [
        {
          position: 1,
          photo: { id: "photo-1" } as never,
        },
        {
          position: 2,
          photo: { id: "photo-2" } as never,
        },
      ],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveSequenceBlock(appContext, block).meta,
    ).toEqual([
      {
        kind: "settings",
        items: [
          {
            id: "iso",
            label: "ISO",
            description: "The camera’s sensitivity to light.",
            value: "ISO 5,000–6,400",
          },
        ],
      },
    ]);
  });
});
