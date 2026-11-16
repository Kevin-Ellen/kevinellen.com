// src/app/life-cycle/app-render/document/head/head.document.app-render.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import { DocumentHead } from "./head.document.app-render";

type Props = Parameters<typeof DocumentHead>[0];
type Head = Props["head"];
type Metadata = Props["metadata"];

describe("DocumentHead", () => {
  const createHead = (overrides: Partial<Head> = {}): Head =>
    ({
      title: "Wildlife Photography | Kevin Ellen",
      description: "Wildlife photography and field notes.",
      canonical: "https://kevinellen.com/",
      locale: "en-GB",
      openGraph: {
        type: "website",
        title: "Wildlife Photography",
        description: "Wildlife photography and field notes.",
        language: "en_GB",
        url: "https://kevinellen.com/",
        image:
          "https://kevinellen.com/assets/images/homepage-open-graph-1200x630.jpg",
        imageWidth: 1200,
        imageHeight: 630,
      },
      themeColor: "#10251a",
      icons: {
        favicon: "/favicon.ico",
        svg: "/favicon.svg",
        appleTouch: "/apple-touch-icon.png",
      },
      manifest: "/site.webmanifest",
      structuredData: [],
      ...overrides,
    }) as Head;

  const createMetadata = (): Metadata =>
    ({
      nonce: "test-csp-nonce",
    }) as Metadata;

  const renderHead = (
    head = createHead(),
    metadata = createMetadata(),
  ): string =>
    renderToStaticMarkup(<DocumentHead head={head} metadata={metadata} />);

  it("renders the document head", () => {
    const html = renderHead();

    expect(html).toMatch(/^<head>/);
    expect(html).toMatch(/<\/head>$/);
  });

  it("renders the character set and viewport", () => {
    const html = renderHead();

    expect(html).toContain('<meta charSet="utf-8"/>');
    expect(html).toContain(
      'name="viewport" content="width=device-width, initial-scale=1"',
    );
  });

  it("renders the page title and description", () => {
    const html = renderHead();

    expect(html).toContain("<title>Wildlife Photography | Kevin Ellen</title>");
    expect(html).toContain(
      'name="description" content="Wildlife photography and field notes."',
    );
  });

  it("escapes special characters in metadata", () => {
    const html = renderHead(
      createHead({
        title: 'Birds & "Wildlife" <Essex>',
        description: "Nature & photography",
      }),
    );

    expect(html).toContain(
      "<title>Birds &amp; &quot;Wildlife&quot; &lt;Essex&gt;</title>",
    );
    expect(html).toContain('content="Nature &amp; photography"');
  });

  it("renders the canonical URL when present", () => {
    const html = renderHead();

    expect(html).toContain(
      '<link rel="canonical" href="https://kevinellen.com/"/>',
    );
  });

  it("omits the canonical link when absent", () => {
    const html = renderHead(createHead({ canonical: null }));

    expect(html).not.toContain('rel="canonical"');
  });

  it("renders the Open Graph locale and theme colour", () => {
    const html = renderHead();

    expect(html).toContain('property="og:locale" content="en_GB"');
    expect(html).toContain('name="theme-color" content="#10251a"');
  });

  it("uses the Open Graph language rather than the document locale", () => {
    const html = renderHead(
      createHead({
        locale: "en-GB",
        openGraph: {
          ...createHead().openGraph,
          language: "nl_NL",
        },
      }),
    );

    expect(html).toContain('property="og:locale" content="nl_NL"');
    expect(html).not.toContain('property="og:locale" content="en-GB"');
  });

  it("renders all favicon declarations", () => {
    const html = renderHead();

    expect(html).toContain('rel="icon" href="/favicon.ico"');
    expect(html).toContain(
      'rel="icon" type="image/svg+xml" href="/favicon.svg"',
    );
    expect(html).toContain(
      'rel="apple-touch-icon" href="/apple-touch-icon.png"',
    );
  });

  it("renders the manifest when present", () => {
    expect(renderHead()).toContain('rel="manifest" href="/site.webmanifest"');
  });

  it("omits the manifest when absent", () => {
    const html = renderHead(createHead({ manifest: undefined }));

    expect(html).not.toContain('rel="manifest"');
  });

  it("does not render JSON-LD when structured data is empty", () => {
    const html = renderHead();

    expect(html).not.toContain('type="application/ld+json"');
  });

  it("renders structured data as a schema.org graph", () => {
    const structuredData = [
      {
        "@type": "Person",
        name: "Kevin Ellen",
      },
      {
        "@type": "WebSite",
        name: "Wildlife Photography",
      },
    ] as Head["structuredData"];

    const html = renderHead(createHead({ structuredData }));

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('nonce="test-csp-nonce"');
    expect(html).toContain('"@context":"https://schema.org"');
    expect(html).toContain('"@graph":[');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"@type":"WebSite"');
  });

  it("escapes less-than characters in JSON-LD", () => {
    const structuredData = [
      {
        "@type": "Thing",
        name: "</script><script>alert(1)</script>",
      },
    ] as Head["structuredData"];

    const html = renderHead(createHead({ structuredData }));

    expect(html).not.toContain("</script><script>alert(1)</script>");

    expect(html).toContain("\\u003c/script>");
    expect(html).toContain("\\u003cscript>");
  });

  it("renders inline CSS with a CSP nonce", () => {
    const html = renderHead();

    expect(html).toContain(
      '<style nonce="test-csp-nonce">body{margin:0}</style>',
    );
  });

  it("uses the supplied nonce for both JSON-LD and CSS", () => {
    const metadata = {
      ...createMetadata(),
      nonce: "another-nonce",
    };

    const html = renderHead(
      createHead({
        structuredData: [
          { "@type": "WebSite", name: "Site" },
        ] as Head["structuredData"],
      }),
      metadata,
    );

    expect(html).toContain(
      '<script nonce="another-nonce" type="application/ld+json"',
    );
    expect(html).toContain('<style nonce="another-nonce"');
    expect(html).not.toContain("test-csp-nonce");
  });

  describe("Open Graph metadata", () => {
    it("renders the required Open Graph properties", () => {
      const html = renderHead();

      expect(html).toContain('property="og:type" content="website"');
      expect(html).toContain(
        'property="og:title" content="Wildlife Photography"',
      );
      expect(html).toContain(
        'property="og:description" content="Wildlife photography and field notes."',
      );
      expect(html).toContain(
        'property="og:url" content="https://kevinellen.com/"',
      );
      expect(html).toContain('property="og:locale" content="en_GB"');
    });

    it("renders article metadata for journal entries", () => {
      const html = renderHead(
        createHead({
          openGraph: {
            type: "article",
            title: "Marsh Harriers at Abberton Reservoir",
            description: "An autumn wildlife encounter.",
            language: "en_GB",
            url: "https://kevinellen.com/journal/marsh-harriers",
            image: "https://kevinellen.com/media/photo/945/630/marsh-harrier",
            imageWidth: 945,
            imageHeight: 630,
          },
        }),
      );

      expect(html).toContain('property="og:type" content="article"');
      expect(html).toContain(
        'property="og:title" content="Marsh Harriers at Abberton Reservoir"',
      );
      expect(html).toContain(
        'property="og:url" content="https://kevinellen.com/journal/marsh-harriers"',
      );
    });

    it("renders an absolute Open Graph image URL", () => {
      const html = renderHead();

      expect(html).toContain(
        'property="og:image" content="https://kevinellen.com/assets/images/homepage-open-graph-1200x630.jpg"',
      );
    });

    it("renders a secure image URL for HTTPS images", () => {
      const html = renderHead();

      expect(html).toContain(
        'property="og:image:secure_url" content="https://kevinellen.com/assets/images/homepage-open-graph-1200x630.jpg"',
      );
    });

    it("omits the secure image URL for HTTP images", () => {
      const html = renderHead(
        createHead({
          openGraph: {
            ...createHead().openGraph,
            image: "http://localhost:8787/media/photo/788/630/dunnock",
            imageWidth: 788,
            imageHeight: 630,
          },
        }),
      );

      expect(html).toContain(
        'property="og:image" content="http://localhost:8787/media/photo/788/630/dunnock"',
      );
      expect(html).not.toContain('property="og:image:secure_url"');
    });

    it("renders the actual resolved image dimensions", () => {
      const html = renderHead(
        createHead({
          openGraph: {
            ...createHead().openGraph,
            imageWidth: 788,
            imageHeight: 630,
          },
        }),
      );

      expect(html).toContain('property="og:image:width" content="788"');
      expect(html).toContain('property="og:image:height" content="630"');
    });

    it("omits image dimensions when they are unknown", () => {
      const html = renderHead(
        createHead({
          openGraph: {
            ...createHead().openGraph,
            imageWidth: null,
            imageHeight: null,
          },
        }),
      );

      expect(html).toContain('property="og:image"');
      expect(html).not.toContain('property="og:image:width"');
      expect(html).not.toContain('property="og:image:height"');
    });

    it("renders image dimensions independently when only one is present", () => {
      const html = renderHead(
        createHead({
          openGraph: {
            ...createHead().openGraph,
            imageWidth: 1200,
            imageHeight: null,
          },
        }),
      );

      expect(html).toContain('property="og:image:width" content="1200"');
      expect(html).not.toContain('property="og:image:height"');
    });

    it("omits every image-related tag when no image is resolved", () => {
      const html = renderHead(
        createHead({
          openGraph: {
            ...createHead().openGraph,
            image: null,
            imageWidth: null,
            imageHeight: null,
          },
        }),
      );

      expect(html).not.toContain('property="og:image"');
      expect(html).not.toContain('property="og:image:secure_url"');
      expect(html).not.toContain('property="og:image:width"');
      expect(html).not.toContain('property="og:image:height"');

      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
    });

    it("escapes special characters in Open Graph metadata", () => {
      const html = renderHead(
        createHead({
          openGraph: {
            ...createHead().openGraph,
            title: 'Birds & "Wildlife" <Essex>',
            description: 'Photography & "nature" <journal>',
          },
        }),
      );

      expect(html).toContain(
        'property="og:title" content="Birds &amp; &quot;Wildlife&quot; &lt;Essex&gt;"',
      );
      expect(html).toContain(
        'property="og:description" content="Photography &amp; &quot;nature&quot; &lt;journal&gt;"',
      );
    });

    it("keeps document metadata independent of Open Graph overrides", () => {
      const html = renderHead(
        createHead({
          title: "Document Title | Kevin Ellen",
          description: "Document description",
          openGraph: {
            ...createHead().openGraph,
            title: "Social Sharing Title",
            description: "Social sharing description",
          },
        }),
      );

      expect(html).toContain("<title>Document Title | Kevin Ellen</title>");
      expect(html).toContain(
        'name="description" content="Document description"',
      );
      expect(html).toContain(
        'property="og:title" content="Social Sharing Title"',
      );
      expect(html).toContain(
        'property="og:description" content="Social sharing description"',
      );
    });
  });
});
