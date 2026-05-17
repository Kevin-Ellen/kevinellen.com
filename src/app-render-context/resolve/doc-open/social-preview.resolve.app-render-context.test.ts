// src/app-render-context/resolve/doc-open/social-preview.resolve.app-render-context.test.ts

import { appRenderContextResolveSocialPreview } from "@app-render-context/resolve/doc-open/social-preview.resolve.app-render-context";

describe("appRenderContextResolveSocialPreview", () => {
  it("returns null when social preview is null", () => {
    expect(appRenderContextResolveSocialPreview(null)).toBeNull();
  });

  it("adds the default twitter card to resolved social preview metadata", () => {
    expect(
      appRenderContextResolveSocialPreview({
        openGraphType: "article",
        siteName: "Kevin Ellen",
        title: "Journal entry | Kevin Ellen",
        description: "A field note about wildlife.",
        url: "https://dev.kevinellen.com/journal/example",
        image: "https://dev.kevinellen.com/media/photo/example/1200/630",
        imageWidth: 1200,
        imageHeight: 630,
      }),
    ).toEqual({
      openGraphType: "article",
      siteName: "Kevin Ellen",
      title: "Journal entry | Kevin Ellen",
      description: "A field note about wildlife.",
      url: "https://dev.kevinellen.com/journal/example",
      image: "https://dev.kevinellen.com/media/photo/example/1200/630",
      imageWidth: 1200,
      imageHeight: 630,
      twitterCard: "summary_large_image",
    });
  });

  it("preserves null image values", () => {
    expect(
      appRenderContextResolveSocialPreview({
        openGraphType: "website",
        siteName: "Kevin Ellen",
        title: "Equipment | Kevin Ellen",
        description: "Camera equipment and field kit.",
        url: "https://dev.kevinellen.com/about/equipment",
        image: null,
        imageWidth: null,
        imageHeight: null,
      }),
    ).toEqual({
      openGraphType: "website",
      siteName: "Kevin Ellen",
      title: "Equipment | Kevin Ellen",
      description: "Camera equipment and field kit.",
      url: "https://dev.kevinellen.com/about/equipment",
      image: null,
      imageWidth: null,
      imageHeight: null,
      twitterCard: "summary_large_image",
    });
  });
});
