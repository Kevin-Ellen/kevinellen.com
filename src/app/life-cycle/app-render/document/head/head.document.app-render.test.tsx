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
      locale: "en_GB",
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

  it("renders locale and theme colour", () => {
    const html = renderHead();

    expect(html).toContain('property="og:locale" content="en_GB"');
    expect(html).toContain('name="theme-color" content="#10251a"');
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
});
