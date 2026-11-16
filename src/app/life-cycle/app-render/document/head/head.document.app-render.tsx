// src/app/life-cycle/app-render/document/head/head.document.app-render.tsx

import type { AppRenderContext } from "../../../app-render-context/class.app-render-context";
import type { MetadataAppRenderContext } from "../../../../types/document/metadata.document.app-render-context.type";

import css from "../../../../assets/css/main.css?raw";

type Props = Readonly<{
  metadata: MetadataAppRenderContext;
  head: AppRenderContext["document"]["head"];
}>;

export const DocumentHead = ({ head, metadata }: Props) => (
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{head.title}</title>
    <meta name="description" content={head.description} />

    {head.canonical && <link rel="canonical" href={head.canonical} />}

    {/* Open Graph */}
    <meta property="og:type" content={head.openGraph.type} />
    <meta property="og:title" content={head.openGraph.title} />
    <meta property="og:description" content={head.openGraph.description} />
    <meta property="og:url" content={head.openGraph.url} />
    <meta property="og:locale" content={head.openGraph.language} />

    {head.openGraph.image && (
      <>
        <meta property="og:image" content={head.openGraph.image} />
        {head.openGraph.image.startsWith("https://") && (
          <meta property="og:image:secure_url" content={head.openGraph.image} />
        )}

        {head.openGraph.imageWidth !== null && (
          <meta
            property="og:image:width"
            content={String(head.openGraph.imageWidth)}
          />
        )}

        {head.openGraph.imageHeight !== null && (
          <meta
            property="og:image:height"
            content={String(head.openGraph.imageHeight)}
          />
        )}
      </>
    )}
    <meta name="theme-color" content={head.themeColor} />

    <link rel="icon" href={head.icons.favicon} />
    <link rel="icon" type="image/svg+xml" href={head.icons.svg} />
    <link rel="apple-touch-icon" href={head.icons.appleTouch} />
    {head.manifest && <link rel="manifest" href={head.manifest} />}

    {head.structuredData.length > 0 && (
      <script
        nonce={metadata.nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": head.structuredData,
          }).replace(/</g, "\\u003c"),
        }}
      />
    )}

    <link
      rel="alternate"
      type="application/rss+xml"
      title="Kevin Ellen — Wildlife Photography & Field Notes"
      href="/rss.xml"
    />

    <style nonce={metadata.nonce}>{css}</style>
  </head>
);
