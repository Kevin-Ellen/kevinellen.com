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
        title: "Journal entry | Kevin Ellen",
        description: "A field note about wildlife.",
        url: "https://dev.kevinellen.com/journal/example",
        image: "https://dev.kevinellen.com/media/photo/example/1200/630",
      }),
    ).toEqual({
      openGraphType: "article",
      title: "Journal entry | Kevin Ellen",
      description: "A field note about wildlife.",
      url: "https://dev.kevinellen.com/journal/example",
      image: "https://dev.kevinellen.com/media/photo/example/1200/630",
      twitterCard: "summary_large_image",
    });
  });

  it("preserves null image and url values", () => {
    expect(
      appRenderContextResolveSocialPreview({
        openGraphType: "website",
        title: "Not found | Kevin Ellen",
        description: "This page could not be found.",
        url: null,
        image: null,
      }),
    ).toEqual({
      openGraphType: "website",
      title: "Not found | Kevin Ellen",
      description: "This page could not be found.",
      url: null,
      image: null,
      twitterCard: "summary_large_image",
    });
  });
});
