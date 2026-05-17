// src/app-state/resolve/social-preview.resolve.app-state.test.ts

import { appStateResolveSocialPreview } from "@app-state/resolve/social-preview.resolve.app-state";

describe("resolveSocialPreview", () => {
  it("inherits title and description from page metadata by default", () => {
    expect(
      appStateResolveSocialPreview({
        metadata: {
          pageTitle: "Journal | Kevin Ellen",
          metaDescription: "Field notes from Epping Forest.",
        },
      }),
    ).toEqual({
      openGraphType: "website",
      image: null,
      title: "Journal | Kevin Ellen",
      description: "Field notes from Epping Forest.",
    });
  });

  it("allows social metadata to override inherited values", () => {
    expect(
      appStateResolveSocialPreview({
        metadata: {
          pageTitle: "Journal | Kevin Ellen",
          metaDescription: "Field notes from Epping Forest.",
        },

        social: {
          openGraphType: "article",
          image: "/social/journal-cover.jpg",
          title: "Custom social title",
          description: "Custom social description",
        },
      }),
    ).toEqual({
      openGraphType: "article",
      image: "/social/journal-cover.jpg",
      title: "Custom social title",
      description: "Custom social description",
    });
  });

  it("supports partial social metadata overrides", () => {
    expect(
      appStateResolveSocialPreview({
        metadata: {
          pageTitle: "Technology | Kevin Ellen",
          metaDescription: "Architecture and rendering notes.",
        },

        social: {
          image: "/social/technology.jpg",
        },
      }),
    ).toEqual({
      openGraphType: "website",
      image: "/social/technology.jpg",
      title: "Technology | Kevin Ellen",
      description: "Architecture and rendering notes.",
    });
  });

  it("defaults open graph type to website", () => {
    expect(
      appStateResolveSocialPreview({
        metadata: {
          pageTitle: "About | Kevin Ellen",
          metaDescription: "About Kevin Ellen.",
        },
      }).openGraphType,
    ).toBe("website");
  });

  it("allows article open graph type override", () => {
    expect(
      appStateResolveSocialPreview({
        metadata: {
          pageTitle: "Unexpected encounters | Kevin Ellen",
          metaDescription: "Mallorca wildlife journal.",
        },

        social: {
          openGraphType: "article",
        },
      }).openGraphType,
    ).toBe("article");
  });
});
