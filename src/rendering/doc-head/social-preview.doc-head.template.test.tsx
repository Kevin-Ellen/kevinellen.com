// src/rendering/doc-head/social-preview.doc-head.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { SocialMeta } from "@rendering/doc-head/social-preview.doc-head.template";

describe("SocialMeta", () => {
  it("renders full OpenGraph and Twitter metadata when image is present", () => {
    const html = renderToStaticMarkup(
      <SocialMeta
        socialPreview={{
          openGraphType: "article",
          siteName: "Kevin Ellen",
          title: "Building this website was worth it | Kevin Ellen",
          description:
            "A technical note on architecture and Cloudflare Workers.",
          url: "https://kevinellen.com/notes/example",
          image: "https://kevinellen.com/media/photo/example/1200/630",
          imageWidth: 1200,
          imageHeight: 630,
          twitterCard: "summary_large_image",
        }}
      />,
    );

    expect(html).toContain('<meta property="og:type" content="article"/>');

    expect(html).toContain(
      '<meta property="og:site_name" content="Kevin Ellen"/>',
    );

    expect(html).toContain(
      '<meta property="og:title" content="Building this website was worth it | Kevin Ellen"/>',
    );

    expect(html).toContain(
      '<meta property="og:description" content="A technical note on architecture and Cloudflare Workers."/>',
    );

    expect(html).toContain(
      '<meta property="og:url" content="https://kevinellen.com/notes/example"/>',
    );

    expect(html).toContain(
      '<meta property="og:image" content="https://kevinellen.com/media/photo/example/1200/630"/>',
    );

    expect(html).toContain('<meta property="og:image:width" content="1200"/>');

    expect(html).toContain('<meta property="og:image:height" content="630"/>');

    expect(html).toContain(
      '<meta name="twitter:card" content="summary_large_image"/>',
    );

    expect(html).toContain(
      '<meta name="twitter:title" content="Building this website was worth it | Kevin Ellen"/>',
    );

    expect(html).toContain(
      '<meta name="twitter:description" content="A technical note on architecture and Cloudflare Workers."/>',
    );

    expect(html).toContain(
      '<meta name="twitter:image" content="https://kevinellen.com/media/photo/example/1200/630"/>',
    );
  });

  it("omits image metadata when image is null", () => {
    const html = renderToStaticMarkup(
      <SocialMeta
        socialPreview={{
          openGraphType: "website",
          siteName: "Kevin Ellen",
          title: "404 | Kevin Ellen",
          description: "Page not found.",
          url: "https://kevinellen.com/404",
          image: null,
          imageWidth: null,
          imageHeight: null,
          twitterCard: "summary_large_image",
        }}
      />,
    );

    expect(html).toContain('<meta property="og:type" content="website"/>');

    expect(html).toContain(
      '<meta property="og:url" content="https://kevinellen.com/404"/>',
    );

    expect(html).toContain(
      '<meta name="twitter:card" content="summary_large_image"/>',
    );

    expect(html).not.toContain('property="og:image"');
    expect(html).not.toContain('property="og:image:width"');
    expect(html).not.toContain('property="og:image:height"');
    expect(html).not.toContain('name="twitter:image"');
  });

  it("renders nothing when social preview is null", () => {
    const html = renderToStaticMarkup(<SocialMeta socialPreview={null} />);

    expect(html).toBe("");
  });
});
