// src/app-context/resolve/social-preview.app-context.test.ts

import { appContextResolveSocialPreview } from "@app-context/resolve/social-preview.app-context";

describe("appContextResolveSocialPreview", () => {
  it("resolves canonical URL and resolved social preview image", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "article",
          image: "https://example.com/social.jpg",
          title: "Custom title",
          description: "Custom description",
        },
        siteName: "Kevin Ellen",
        imageWidth: 1200,
        imageHeight: 630,
        origin: "https://kevinellen.com",
        slug: "/journal/example",
        image: "https://example.com/social.jpg",
      }),
    ).toEqual({
      openGraphType: "article",
      siteName: "Kevin Ellen",
      image: "https://example.com/social.jpg",
      imageWidth: 1200,
      imageHeight: 630,
      title: "Custom title",
      description: "Custom description",
      url: "https://kevinellen.com/journal/example",
    });
  });

  it("uses inherited image when provided by AppContext", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "article",
          image: null,
          title: "Example",
          description: "Description",
        },
        siteName: "Kevin Ellen",
        imageWidth: 1200,
        imageHeight: 630,
        origin: "https://kevinellen.com",
        slug: "/journal/example",
        image: "https://kevinellen.com/media/photo/example/1200/630",
      }),
    ).toEqual({
      openGraphType: "article",
      siteName: "Kevin Ellen",
      image: "https://kevinellen.com/media/photo/example/1200/630",
      imageWidth: 1200,
      imageHeight: 630,
      title: "Example",
      description: "Description",
      url: "https://kevinellen.com/journal/example",
    });
  });

  it("returns null when social preview is null", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: null,
        siteName: "Kevin Ellen",
        imageWidth: null,
        imageHeight: null,
        origin: "https://kevinellen.com",
        slug: "/journal/example",
        image: null,
      }),
    ).toBeNull();
  });

  it("returns null when slug is null", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "website",
          image: null,
          title: "404",
          description: "Page not found",
        },
        siteName: "Kevin Ellen",
        imageWidth: null,
        imageHeight: null,
        origin: "https://kevinellen.com",
        slug: null,
        image: null,
      }),
    ).toBeNull();
  });

  it("preserves null image dimensions when image is null", () => {
    expect(
      appContextResolveSocialPreview({
        socialPreview: {
          openGraphType: "website",
          image: null,
          title: "Equipment",
          description: "Camera equipment.",
        },
        siteName: "Kevin Ellen",
        imageWidth: null,
        imageHeight: null,
        origin: "https://kevinellen.com",
        slug: "/about/equipment",
        image: null,
      }),
    ).toEqual({
      openGraphType: "website",
      siteName: "Kevin Ellen",
      image: null,
      imageWidth: null,
      imageHeight: null,
      title: "Equipment",
      description: "Camera equipment.",
      url: "https://kevinellen.com/about/equipment",
    });
  });
});
