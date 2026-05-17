// src/app-context/resolve/social-preview.app-context.test.ts

import { appContextResolveSocialPreview } from "@app-context/resolve/social-preview.app-context";

describe("appContextResolveSocialPreview", () => {
  it("resolves canonical URL and preserves existing social preview values", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "article",
          image: "https://example.com/social.jpg",
          title: "Custom title",
          description: "Custom description",
        },

        origin: "https://kevinellen.com",
        slug: "/journal/example",
        image: null,
      }),
    ).toEqual({
      openGraphType: "article",
      image: "https://example.com/social.jpg",
      title: "Custom title",
      description: "Custom description",
      url: "https://kevinellen.com/journal/example",
    });
  });

  it("inherits image when explicit image is null", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "article",
          image: null,
          title: "Example",
          description: "Description",
        },

        origin: "https://kevinellen.com",
        slug: "/journal/example",
        image: "https://kevinellen.com/media/photo/example/1200/630",
      }),
    ).toEqual({
      openGraphType: "article",
      image: "https://kevinellen.com/media/photo/example/1200/630",
      title: "Example",
      description: "Description",
      url: "https://kevinellen.com/journal/example",
    });
  });

  it("returns null URL when slug is null", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "website",
          image: null,
          title: "404",
          description: "Page not found",
        },

        origin: "https://kevinellen.com",
        slug: null,
        image: null,
      }),
    ).toEqual({
      openGraphType: "website",
      image: null,
      title: "404",
      description: "Page not found",
      url: null,
    });
  });

  it("prefers explicit image over inherited image", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "article",
          image: "https://example.com/explicit.jpg",
          title: "Example",
          description: "Description",
        },

        origin: "https://kevinellen.com",
        slug: "/journal/example",

        image: "https://kevinellen.com/media/photo/inherited/1200/630",
      }),
    ).toEqual({
      openGraphType: "article",
      image: "https://example.com/explicit.jpg",
      title: "Example",
      description: "Description",
      url: "https://kevinellen.com/journal/example",
    });
  });
});
