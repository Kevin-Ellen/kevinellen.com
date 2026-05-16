// src/rendering/doc-head/doc-head.template.tsx

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";

import CSS from "../../../.build/generated/styles.css?raw";

import {
  InlineScript,
  LinkScript,
} from "@rendering/shared/script.shared.template";

import {
  CanonicalLink,
  HeadLink,
  PreloadLink,
} from "@rendering/doc-head/link.doc-head.template";

type DocHeadTemplateProps = Readonly<{
  docOpen: AppRenderContextDocOpen;
}>;

export const DocHeadTemplate = ({ docOpen }: DocHeadTemplateProps) => (
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <style nonce={docOpen.nonce}>{CSS}</style>

    <title>{docOpen.metadata.pageTitle}</title>
    <meta name="description" content={docOpen.metadata.metaDescription} />

    {docOpen.canonicalUrl ? (
      <CanonicalLink href={docOpen.canonicalUrl} />
    ) : null}

    <meta name="theme-color" content={docOpen.themeColour} />

    {docOpen.preload.map((preload) => (
      <PreloadLink
        key={`${preload.rel}:${preload.href}:${preload.as}`}
        preload={preload}
      />
    ))}

    {docOpen.links.map((link) => (
      <HeadLink key={`${link.rel}:${link.href}`} link={link} />
    ))}

    {docOpen.linkScripts.map((script) => (
      <LinkScript key={script.src} script={script} />
    ))}

    {docOpen.inlineScripts.map((script, index) => (
      <InlineScript key={`inline-script:${index}`} script={script} />
    ))}
  </head>
);
